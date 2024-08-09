const nodeMailer = require('nodemailer');
const { createTokenUsers } = require("../../utils/handler-token");
const { HOST_TRANSPORT_EMAIL, USER_EMAIL_SUPPORT, PASSWORD_EMAIL_SUPPORT } = require('../../utils/secret.json');

const handlerGoogleLoginUsers = async (request, h) => {
  const { profile } = request.auth.credentials;

  try {
    const dataToken = JSON.stringify(profile.raw);
    return h.redirect(`/user/api/google/callback?raw=${dataToken}&type=web`);
  } catch (err) {
    console.error('Terjadi error saat login google: ', err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan, Coba lagi.',
    }).code(500);
  }
};

const handlerCallbackAfterLoginGoogle = async (request, h) => {
  const rawParam = request.query.raw;
  const paramType = request.query.type;

  if (!rawParam || !paramType) {
    return h.response({
      status: 'error',
      message: 'params ada yang kurang!',
    }).code(400);
  }

  try {
    const parseDataRaw = JSON.parse(rawParam);

    if (!parseDataRaw) {
      return h.response({
        status: 'error',
        message: 'data untuk token tidak ada.',
      }).code(400);
    }

    if (!parseDataRaw.sub
        || !parseDataRaw.name
        || !parseDataRaw.given_name
        || !parseDataRaw.family_name
        || !parseDataRaw.picture
        || !parseDataRaw.email
        || !parseDataRaw.email_verified) {
      return h.response({
        status: 'error',
        message: 'ada data yang kurang.',
      }).code(400);
    }

    if (!paramType || paramType !== 'web') {
      return h.response({
        status: 'error',
        message: 'type salah',
      }).code(400);
    }

    const createTokenAccess = createTokenUsers(parseDataRaw);
    return h.redirect(`https://stagingadmin.my.id/?token=${createTokenAccess}`);
  } catch (err) {
    console.error('Ada error saat callback setelah google: ', err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat callback.',
    }).code(500);
  }
};

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
const email = 'test@email.com';
const mailOptions = {
  from: '"Ayotaku.id Support" <support@stagingadmin.my.id>',
  to: email, // Email tujuan
  subject: '[no-reply] Verification Code',
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
                <h1>Selamat di Ayotaku.id!</h1>
                <p>Ini adalah Email Otomatis yang dikirim kan kepada User untuk memberikan Link Verification Email. Klik lik dibawah ini untuk Verification Email anda!</p>
                <p>Click Button dibawah ini ya...😊</p>
                <a href="http://stagingadmin.my.id/" class="btn-primary">Verify Email</a>
                <p></p>
                <p>Best regards,<br>The Ayotaku.id Team</p>
              </div>
            </body>
          </html>`,
};

const sendCodeVerificationUser = async (request, h) => {
  transporterEmail.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    return info.messageId;
  });

  return h.response({
    status: 'success',
    message: 'Email berhasil dikirim!',
  }).code(200);
};

module.exports = {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
  sendCodeVerificationUser,
};
