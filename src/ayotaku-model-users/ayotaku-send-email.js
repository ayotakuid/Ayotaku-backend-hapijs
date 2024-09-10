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
                
                <a href="http://localhost:5173/activate?email=${emailUser}&code=${code}" class="btn-primary">Activation Email</a>
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
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="card mt-2" style="width: 70%;">
                  <div class="card-body">
                    <h5 class="card-title">Reset Password</h5>
                    <p class="card-text" style="font-size: 13px;">
                      Ini adalah Email Otomatis yang dikirim kan kepada User untuk memberikan Link Reset Password, Click button di bawah ini untuk masuk ke Form Reset Password Account Ayotaku.id! <strong>Link hanya berlaku selama 2 Menit.</strong>
                    </p>
                    <a class="btn btn-primary btn-sm" id="click">Reset Password</a>

                    <p class="card-text mt-4" style="font-size: 13px;">Atau kalian bisa Click URL dibawah ini jika Button tidak mengarahkan Anda ke Form Reset Password.</p>
                    <a 
                      href="http://localhost:5173/profile/me/password?email=asd&code=asd&exp=asd" 
                      style="font-size: 13px;"
                    >
                      http://localhost:5173/profile/me/password?email=asd&code=asd&exp=asd
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <script>
            document.getElementById('click').onclick = () => {
              const url = 'http://localhost:5173/profile/me/password?email=asd&code=asd&exp=asd'
              window.open(url, "_blank");
            }
          </script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </body>
      </html>`,
  };

  transporterEmail.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return {
        status: 'fail',
      };
    }

    return {
      status: 'success',
      data: info.messageId,
    };
  });
};

module.exports = {
  sendCodeVerifyUser,
  sendLinkChangePassword,
};
