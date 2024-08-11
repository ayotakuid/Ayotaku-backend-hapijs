const nodeMailer = require('nodemailer');
const {
  HOST_TRANSPORT_EMAIL,
  USER_EMAIL_SUPPORT,
  PASSWORD_EMAIL_SUPPORT,
} = require('../utils/secret.json');

const sendCodeVerifyUser = async (emailUser, code) => {
  const transporterEmail = nodeMailer.createTransport({
    host: HOST_TRANSPORT_EMAIL,
    port: 465,
    secure: true,
    auth: {
      user: USER_EMAIL_SUPPORT,
      pass: PASSWORD_EMAIL_SUPPORT,
    },
    debug: true,
    logger: true,
  });
  const mailOptions = {
    from: '"Ayotaku.id Support" <support@stagingadmin.my.id>',
    to: emailUser,
    subject: '[no-reply] Activation Email',
    html: `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                /* Inline CSS karena banyak klien email tidak mendukung style external */
                .btn-primary {
                  background-color: #007bff;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: auto;
                  padding: 20px;
                  border: 1px solid #dddddd;
                  border-radius: 10px;
                  background-color: #f9f9f9;
                }
                h1 {
                  color: #333333;
                }
                p {
                  color: #666666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Selamat datang di Ayotaku.id!</h1>
                <p>Ini adalah Email Otomatis yang dikirim kan kepada User untuk memberikan Link Activation Email. Klik lik dibawah ini untuk Activation Email anda!</p>
                <p>Click Button dibawah ini ya...😊</p>
                
                <a href="http://localhost:9001/user/api/active-email?email=${emailUser}&code=${code}" class="btn-primary">Activation Email</a>
                <break>
                <p>Best regards,<br>Ayotaku.id Team</p>
              </div>
            </body>
          </html>`,
  };
  transporterEmail.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    return info.messageId;
  });
};

module.exports = {
  sendCodeVerifyUser,
};
