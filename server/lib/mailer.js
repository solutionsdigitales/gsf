const nodemailer = require('nodemailer');

// send immatriculation request letter by mail
function sendMail(subject, descrition, fromUserName, toMail) {
  if(process.env.NODE_ENV === 'development') return;
  if(!toMail) return;
  const isEmail = toMail.indexOf('@') !== -1; // correct email adress contains @
  if(!isEmail) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  const mailOptions = {
    from: `${fromUserName} <${process.env.SMTP_USERNAME}>`,
    to: toMail,
    subject,
    html: descrition,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('--------------- MAIL NON ENVOYE -------------------------', error);
          return reject(error);
        }
        debug('Mail send succefully => ');
        debug(JSON.stringify(info));
        return resolve(info);
      });
  });
}

module.exports = {
  sendMail,
}
