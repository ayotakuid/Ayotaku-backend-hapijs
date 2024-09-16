const { modelSaveResetPassword, modelChangePassword } = require("../../ayotaku-model-users/ayotaku-model-password");
const { modelFindUserGlobal } = require("../../ayotaku-model-users/ayotaku-model-users");
const { sendLinkChangePassword } = require("../../ayotaku-model-users/ayotaku-send-email");
const { validateCode, createTicketCodeReset, verifyCodeCaptcha } = require("../../utils/handler-moment");
const { generateHashPassword } = require("../../utils/handler-token");

const handlerSendLinkResetPassword = async (request, h) => {
  const credentialsuser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const findUserFirst = await modelFindUserGlobal(credentialsuser.email_google);

    if (findUserFirst.length > 0) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan!',
      }).code(400);
    }

    const dataCreateTicket = createTicketCodeReset(findUserFirst.uuid);
    const dataReset = {
      userId: dataCreateTicket.userId,
      code: dataCreateTicket.code,
      exp: dataCreateTicket.exp.toISOString(),
      created_at: new Date().toISOString(),
    };
    const responseCreateTicket = await modelSaveResetPassword(dataReset);
    const responseSendLinkToEmail = await sendLinkChangePassword(findUserFirst.from_google.email, dataReset);

    return h.response({
      status: 'sucess',
      message: 'Link reset berhasil dikirim!',
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerValidateSessionReset = async (request, h) => {
  const { emailUser, codeUser, expiredUser } = request.payload;
  const credentialsuser = request.auth.credentials;
  const tokenUsers = request.headers.authorization;
  const tokenSplit = tokenUsers.split(' ');

  try {
    const findUserFirst = await modelFindUserGlobal(credentialsuser.email_google);

    if (findUserFirst.length > 0) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan!',
      }).code(400);
    }

    const responseValidateTicket = await validateCode(findUserFirst.uuid, codeUser);

    if (!responseValidateTicket.validate) {
      return h.response({
        status: 'fail',
        message: responseValidateTicket.message,
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: responseValidateTicket,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerFormResetPassword = async (request, h) => {
  const { newPassword, codeCaptcha, codeTicket } = request.payload;
  const credentialsuser = request.auth.credentials;
  const tokenUser = request.auth.authorization;

  const findUser = await modelFindUserGlobal(credentialsuser.email_google);

  if (!findUser) {
    return h.response({
      status: 'fail',
      message: 'User tidak ditemukan!',
    }).code(404);
  }

  const validate = await validateCode(findUser.uuid, codeTicket);

  if (!validate.validate) {
    return h.response({
      status: 'fail',
      message: validate.message,
    }).code(400);
  }

  if (!newPassword) {
    return h.response({
      status: 'fail',
      message: 'Password tidak boleh kosong!',
    }).code(400);
  }

  if (!codeCaptcha) {
    return h.response({
      status: 'fail',
      message: 'Please verify the re-CAPTCHA!',
    }).code(400);
  }

  if (!codeTicket) {
    return h.response({
      status: 'fail',
      message: 'Code tidak boleh kosong!',
    }).code(400);
  }

  const responseValidateCode = await verifyCodeCaptcha(codeCaptcha);
  if (!responseValidateCode.success) {
    return h.response({
      status: 'fail',
      message: 'Timeout, Try again!',
    }).code(400);
  }

  const hashPassword = await generateHashPassword(newPassword);
  const modelChange = await modelChangePassword(findUser.from_google.email, hashPassword);

  if (!modelChange.status) {
    return h.response({
      status: 'fail',
      message: 'Change Password gagal!',
    }).code(400);
  }

  return h.response({
    status: 'success',
    message: 'Change password success!',
  }).code(200);
};

module.exports = {
  handlerSendLinkResetPassword,
  handlerValidateSessionReset,
  handlerFormResetPassword,
};
