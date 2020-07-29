const MongoClient = require('mongodb').MongoClient;
const { nanoid } = require('nanoid');
const ejs = require('ejs');
const { validateEmail, logger, readDataFromCSV } = require('./utils');
const CONFIGS = require('./configs');
const mailService = require('./mail-services');

// Start script
(async () => {
  logger('\r\n\r\n', true);
  logger(`==================${new Date(Date.now()).toString()}==================`);
  logger(`[MAIL_SERVICE]: ${CONFIGS.MAIL_SERVICE}`)
  console.debug('[DEBUG]: Staring');
  console.debug(`[DEBUG]: Using mail service: ${CONFIGS.MAIL_SERVICE}`);
  console.debug('[DEBUG]: Parsing user from csv');
  const listUsers = readDataFromCSV(CONFIGS.CSV_PATH);

  const client = await MongoClient.connect(CONFIGS.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.debug('[DEBUG]: Connected to mongodb');

  const db = client.db(CONFIGS.DB_NAME);

  listUsers.forEach((user, index) => {
    setTimeout(async () => {
      console.debug(`[DEBUG]: Starting send email [${index}] to: ${user.emailAddress}`);

      try {
        if (!validateEmail(user.emailAddress)) {
          console.log(`[ERROR]: Invalid email: ${user.emailAddress}`);
          logger(`[ERROR]: Invalid email: ${user.emailAddress}`);

          if (index === listUsers.length - 1) {
            client.close();
            console.debug('[DEBUG]: Closed connection');
            process.exit(1);
          }

          return;
        }

        const token = nanoid(48);

        await db.collection('user').updateOne(
          { emailAddress: user.emailAddress },
          {
            $set: {
              passwordResetToken: token,
              passwordResetTokenExpiresAt:
                Date.now() + CONFIGS.PASSWORD_RESET_TTL,
            },
          },
        );
        console.debug('[DEBUG]: User updated');

        const templateData = {
          firstName: user.firstName,
          token,
          callbackUrl: `${CONFIGS.APP_DOMAIN}/reset-password`,
        };

        ejs.renderFile(
          './reset-password-template.ejs',
          templateData,
          async (err, html) => {
            if (err) {
              console.error(err);
              return;
            }

            const mailOptions = {
              from: CONFIGS.MAIL_SENDER,
              to: user.emailAddress,
              subject: CONFIGS.MAIL_SUBJECT,
              html,
            };

            await mailService.send(mailOptions, (err) => {
              if (err) {
                logger(
                  `[ERROR]: Cannot send to email: ${user.emailAddress} with error: ${err}`,
                );
                console.log(
                  `[ERROR]: Cannot send to email: ${user.emailAddress}`,
                );
              } else {
                console.debug(
                  `[DEBUG]: Send email successfully`,
                );
              }

              if (index === listUsers.length - 1) {
                client.close();
                console.debug('[DEBUG]: Closed connection');
                process.exit(1);
              }
            });
          },
        );
      } catch (e) {
        console.log(`[ERROR]: Something wrong: ${e}`);
      }
    }, CONFIGS.MAIL_DELAY * index);
  });
})();
