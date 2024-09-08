const { nanoid } = require('nanoid');
const nodeMailer = require('nodemailer');
const Bcrypt = require('bcrypt');
const { createTokenUsers, createTokenUserForm, generateHashPassword } = require("../../utils/handler-token");
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
  modelFindUserByUsername,
  modelUpdateDisplayUsername,
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
      const updatingInfoUser = await modelUpdateUserInfoLogin(userInformation.parseDataRaw.email, createTokenAccess, paramType);

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

// HANDLER UNTUK PROFILE USER
const handlerProfileUser = async (request, h) => {
  const credentialsuser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const findUser = await modelFindUserGlobal(credentialsuser.email_google);

    if (findUser.tokenWeb !== tokenSplit[1]) {
      return h.response({
        status: 'fail',
        message: 'Token tidak sesuai!',
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'User profile',
      data: {
        uuid: findUser.uuid,
        from_google: findUser.from_google,
        via_register: findUser.via_register,
        account_active: findUser.account_active,
        username: findUser.username,
        displayUsername: findUser.displayUsername,
        isLogin: findUser.isLogin,
        timeLogin: findUser.timeLogin,
        tokenWeb: findUser.tokenWeb,
        tokenMob: findUser.tokenMob,
        created_at: findUser.created_at,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan saat ambil Profile',
    }).code(400);
  }
};

// HANDLER UNTUK SIGN UP LEWAT FORM
const handlerSignupUser = async (request, h) => {
  const {
    _email,
    _username,
    _password,
    _type,
  } = request.payload;

  try {
    const codeActived = nanoid(32);
    const createAvatar = await createAvatarDefault(_username);
    const hashPassword = await generateHashPassword(_password);
    const dataToken = {
      username: _username,
      email: _email,
      type: _type,
    };
    const createTokenAccess = createTokenUserForm(dataToken, dataToken.type);
    const dataSignUpUser = {
      parseDataRaw: {
        sub: null,
        name: null,
        email: _email,
        picture: createAvatar,
        email_verified: null,
      },
      via_register: 'form',
      code_actived: codeActived,
      username: _username,
      displayUsername: null,
      password: hashPassword,
      tokenWeb: (_type === 'web') ? createTokenAccess : null,
      tokenMob: (_type === 'mobile') ? createTokenAccess : null,
    };

    const responseModelSaveUser = await modelSaveUserInformation(dataSignUpUser, dataSignUpUser.tokenWeb, dataSignUpUser.tokenMob);

    if (!responseModelSaveUser.register) {
      return h.response({
        status: 'fail',
        message: responseModelSaveUser.message,
      }).code(401);
    }

    await sendCodeVerifyUser(dataSignUpUser.parseDataRaw.email, codeActived);
    return h.response({
      status: 'success',
      message: 'Register Success, Check your email.',
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Kesalahan saat Sign Up!',
    }).code(400);
  }
};

// HANDLER UNTUK SIGN IN LEWAT FORM
const handlerSignInUser = async (request, h) => {
  const { _username, _password, _type } = request.payload;

  try {
    const findUser = await modelFindUserByUsername(_username);

    if (!findUser.account) {
      return h.response({
        status: 'fail',
        message: findUser.message,
      }).code(404);
    }

    const comparePassword = await Bcrypt.compare(_password, findUser.data?.password);
    if (!comparePassword) {
      return h.response({
        status: 'fail',
        message: 'Password salah, coba lagi!',
      }).code(401);
    }

    const dataToken = {
      username: _username,
      email: findUser.data?.from_google.email,
      type: _type,
    };
    const createTokenAccess = createTokenUserForm(dataToken, _type);
    const updateUserLogin = await modelUpdateUserInfoLogin(findUser.data?.from_google.email, createTokenAccess, _type);

    if (!updateUserLogin.status === 'fail') {
      return h.response({
        status: 'fail',
        message: updateUserLogin.message,
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'Sign in successfully!',
      user: {
        uuid: updateUserLogin.uuid,
        from_google: updateUserLogin.from_google,
        username: updateUserLogin.username,
        tokenWeb: updateUserLogin.tokenWeb,
        tokenMob: updateUserLogin.tokenMob,
        created_at: updateUserLogin.created_at,
      },
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Ada kesalahan saat Sign in!',
    }).code(401);
  }
};

const handlerUpdateDisplayUsername = async (request, h) => {
  const { _displayUsername } = request.payload;
  const credentialsuser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const findUser = await modelFindUserGlobal(credentialsuser.email_google);

    if (findUser.tokenWeb !== tokenSplit[1]) {
      return h.response({
        status: 'fail',
        message: 'Token tidak sesuai!',
      }).code(401);
    }

    const responseUpdateInformation = await modelUpdateDisplayUsername(_displayUsername, findUser.from_google.email);

    if (!responseUpdateInformation.data) {
      return h.response({
        status: 'fail',
        message: responseUpdateInformation?.message,
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: responseUpdateInformation?.message,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat Update Display Username',
    }).code(404);
  }
};

module.exports = {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
  handlerActivatedAccount,
  handlerProfileUser,
  handlerSignupUser,
  handlerSignInUser,
  handlerUpdateDisplayUsername,
};
