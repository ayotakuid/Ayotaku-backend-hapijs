const { nanoid } = require('nanoid');
const nodeMailer = require('nodemailer');
const { createTokenUsers } = require("../../utils/handler-token");
const {
  HOST_TRANSPORT_EMAIL,
  USER_EMAIL_SUPPORT,
  PASSWORD_EMAIL_SUPPORT,
} = require('../../utils/secret.json');
const {
  modelSaveUserInformation,
  modelUpdateUserInfoLogin,
  modelActivatedAccount,
  modelFindUserGlobal,
} = require('../../ayotaku-model-users/ayotaku-model-users');
const { sendCodeVerifyUser } = require('../../ayotaku-model-users/ayotaku-send-email');
const { templateHtmlAfterLogin, templateHtmlAccountNotActive, templateHtmlCancelLoginGoogle } = require('../../utils/template-html');
const { createAvatarDefault } = require('../../utils/handler-avatar');

const handlerGoogleLoginUsers = async (request, h) => {
  const { profile } = request.auth.credentials;
  const { error, state } = request.query;

  try {
    if (error === "access_denied" && !state) {
      console.log(error);
      return h.response({
        status: 'fail',
        message: 'User cancel it!',
      }).code(400);
    }

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
    const createTokenAccess = createTokenUsers(parseDataRaw, paramType);
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
      const updatingInfoUser = await modelUpdateUserInfoLogin(userInformation.parseDataRaw.email, createTokenAccess);

      if (updatingInfoUser.account === false) {
        const dataChecking = (!updatingInfoUser.account) ? 'not_active' : '';
        return h.response(templateHtmlAccountNotActive(dataChecking)).type('text/html');
      }

      return h.response(templateHtmlAfterLogin(updatingInfoUser.tokenWeb, true)).type('text/html');
    }

    await sendCodeVerifyUser(userInformation.parseDataRaw.email, codeActived);
    return h.redirect(`/user/api/google/callback?raw=${rawParam}&type=web`);
  } catch (err) {
    console.error('Ada error saat callback setelah google: ', err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat callback.',
    }).code(500);
  }
};

const handlerActivatedAccount = async (request, h) => {
  const { _email, _code } = request.payload;

  try {
    const dataUser = {
      email: _email,
      code: _code,
    };
    const responseActivated = await modelActivatedAccount(dataUser);
    if (responseActivated.status === 'fail') {
      return h.response({
        status: 'fail',
        message: responseActivated.message,
      }).code(404);
    }

    const responseUser = await modelFindUserGlobal(_email);
    const dataRawParams = {
      sub: responseUser.from_google.id_google,
      name: responseUser.from_google.nama_google,
      email: responseUser.from_google.email,
      picture: responseUser.from_google.picture,
      email_verified: responseUser.from_google.email_verified,
    };
    const parseObject = JSON.stringify(dataRawParams);

    // return h.redirect(`/user/api/google/callback?raw=${parseObject}&type=web`);
    return h.response({
      status: 'success',
      message: 'Berhasil diaktifkan',
      data: {
        _isLogin: true,
        tokenWeb: responseUser.tokenWeb,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat Activated Account',
    }).code(401);
  }
};

const handlerProfileUser = async (request, h) => {
  const credentialsuser = request.auth.credentials;
  const tokenUser = request.headers.authorization;

  try {
    return h.response({
      status: 'success',
      data: credentialsuser,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan saat ambil Profile',
    }).code(400);
  }
};

const handlerSignupUser = async (request, h) => {
  const {
    _email,
    _username,
    _password,
    _type,
  } = request.payload;

  try {
    const dataSignUpUser = {
      email: _email,
      username: _username,
      password: _password,
      via: 'form',
      picture: await createAvatarDefault(_username),
    };

    return h.response({
      status: 'success',
      message: 'Register Success, Check your email.',
      data: dataSignUpUser,
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Kesalahan saat Sign Up!',
    }).code(400);
  }
};

module.exports = {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
  handlerActivatedAccount,
  handlerProfileUser,
  handlerSignupUser,
};
