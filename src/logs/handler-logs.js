const { handlerGetAllLogs } = require("../model/model-logs");
const { checkingTokenForAll } = require("../utils/handler-token");

const handlerLogs = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;

  try {
    const allLogs = await handlerGetAllLogs();
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.message,
        message: isExpired?.message,
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'Total User',
      data: allLogs,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerLogs,
};
