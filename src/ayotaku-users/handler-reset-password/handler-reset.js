const { modelSaveResetPassword } = require("../../ayotaku-model-users/ayotaku-model-password");
const { modelFindUserGlobal } = require("../../ayotaku-model-users/ayotaku-model-users");
const { sendLinkChangePassword } = require("../../ayotaku-model-users/ayotaku-send-email");
const { validateCode, createTicketCodeReset } = require("../../utils/handler-moment");

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

module.exports = {
  handlerSendLinkResetPassword,
};
