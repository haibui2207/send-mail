const csv = require('csv-parser');
const fs = require('fs');

const validateEmail = (email) =>
  email &&
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase(),
  );
const logger = (message, rawMessage = false) => {
  const date = new Date(Date.now()).toString();
  const formatedMessage = rawMessage ? message : `[${date}]: ${message}\r\n`;
  fs.appendFileSync('./log.txt', formatedMessage);
};

const readDataFromCSV = async (csvPath) =>
  new Promise((rs, rj) => {
    {
      const result = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          result.push({ emailAddress: data.Email, firstName: data.FirstName });
        })
        .on('end', () => {
          rs(result);
        })
        .on('error', rj);
    }
  });

module.exports = {
  validateEmail,
  logger,
  readDataFromCSV,
};
