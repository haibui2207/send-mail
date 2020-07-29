const Mailgun = require('mailgun-js');
const nodemailer = require('nodemailer');
const CONFIGS = require('./configs');

// mailgun
const mailgun = new Mailgun({
  apiKey: CONFIGS.MAILGUN_API_KEY,
  domain: CONFIGS.MAILGUN_DOMAIN,
});

// nodemailer
const transporter = nodemailer.createTransport(CONFIGS.NODEMAILER_OPTIONS);

const send = async (options, callback) => {
  if (CONFIGS.MAIL_SERVICE === 'MAILGUN') {
    await mailgun.messages().send(options, callback);
  } else {
    try {
      await transporter.sendMail(options);
      callback(null);
    } catch (e) {
      callback(e);
    }
  }
};

module.exports = { send };
