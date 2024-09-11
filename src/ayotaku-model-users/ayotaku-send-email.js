const nodeMailer = require('nodemailer');
const {
  HOST_TRANSPORT_EMAIL,
  USER_EMAIL_SUPPORT,
  PASSWORD_EMAIL_SUPPORT,
  URI_SELF_WEB,
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
                
                <a href="${URI_SELF_WEB}activate?email=${emailUser}&code=${code}" class="btn-primary">Activation Email</a>
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

const sendLinkChangePassword = async (emailUser, data) => {
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
    subject: '[no-reply] Reset Password',
    html: `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
              }

              .container {
                width: 90%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
              }

              .row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
              }

              .col-md-12 {
                flex: 0 0 100%;
                max-width: 100%;
              }

              .card {
                background-color: #f9f9f9;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px #6e6e6e solid;
                margin-top: 20px;
                padding: 20px;
                width: 70%;
              }

              .card-body {
                padding: 20px;
              }

              .card-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 10px;
              }

              .card-text {
                font-size: 13px;
                margin-bottom: 20px;
                line-height: 1.5;
              }

              .btn {
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                font-size: 12px;
                cursor: pointer;
              }

              .btn:hover {
                background-color: #0056b3;
              }

              a {
                color: #007bff;
                text-decoration: none;
              }

              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="row">
                <div class="col-md-12">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Reset Password [ ${emailUser} ]</h5>
                      <p class="card-text">
                        Ini adalah Email Otomatis yang dikirimkan kepada User untuk memberikan Link Reset Password. Klik button di bawah ini untuk masuk ke Form Reset Password Account Ayotaku.id! <strong>Link hanya berlaku selama 2 Menit.</strong>
                      </p>
                      <a href="${URI_SELF_WEB}profile/me/password?email=${emailUser}&code=${data.code}&exp=${data.exp}" 
                        style="background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-size:12px; display:inline-block;">
                        Reset Password
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
    `,
  };

  const responseTrans = transporterEmail.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return {
        status: false,
      };
    }

    return {
      status: true,
      data: info.messageId,
    };
  });
};

module.exports = {
  sendCodeVerifyUser,
  sendLinkChangePassword,
};
