const { nanoid } = require('nanoid');
const nodeMailer = require('nodemailer');
const { createTokenUsers } = require("../../utils/handler-token");
const { HOST_TRANSPORT_EMAIL, USER_EMAIL_SUPPORT, PASSWORD_EMAIL_SUPPORT } = require('../../utils/secret.json');
const { modelSaveUserInformation } = require('../../ayotaku-model-users/ayotaku-model-users');
const { sendCodeVerifyUser } = require('../../ayotaku-model-users/ayotaku-send-email');

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

    const codeActived = nanoid(32);
    const createTokenAccess = createTokenUsers(parseDataRaw);
    const userInformation = {
      parseDataRaw,
      via_register: 'google',
      code_actived: codeActived,
      username: null,
      displayUsername: null,
      password: null,
      tokenWeb: (paramType === 'web') ? createTokenAccess : null,
      tokenMob: (paramType === 'mobile') ? createTokenAccess : null,
    };

    const saveUserInfomation = await modelSaveUserInformation(userInformation, userInformation.tokenWeb, userInformation.tokenMob);
    if (!saveUserInfomation.register) {
      return h.response({
        status: 'success',
        message: 'Email sudah ada!',
      }).code(200);
    }

    // return h.redirect(`https://stagingadmin.my.id/?token=${createTokenAccess}`);
    await sendCodeVerifyUser(userInformation.parseDataRaw.email, codeActived);
    return h.response({
      status: 'success',
      message: 'Register berhasil!',
    }).code(200);
  } catch (err) {
    console.error('Ada error saat callback setelah google: ', err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat callback.',
    }).code(500);
  }
};

module.exports = {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
};
