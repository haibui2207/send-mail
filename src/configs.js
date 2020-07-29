const mongoUser = '';
const mongoPass = '';
const mongoHost = 'localhost';
const mongoPort = '27017';
const dbName = 'admin';

module.exports = {
  // mail config
  MAILGUN_API_KEY: '',
  MAILGUN_DOMAIN: '',
  MAIL_SENDER: 'Example <example@gamil.com>',
  MAIL_SUBJECT: 'Here is mail subject',
  MAIL_DELAY: 10000, // Delay each email

  NODEMAILER_OPTIONS: {
    host: '',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: '',
      pass: '',
    },
  },

  MAIL_SERVICE: 'NODEMAILER', // 'MAILGUN' or 'NODEMAILER'

  // DB config
  DB_NAME: dbName,
  MONGO_URL: `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${dbName}`,

  // other configs
  PASSWORD_RESET_TTL: 24 * 60 * 60 * 1000, // 24hrs
  APP_DOMAIN: 'http://localhost:3000',
  CSV_PATH: 'data.csv',
};
