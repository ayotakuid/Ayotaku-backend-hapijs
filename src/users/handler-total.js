const { checkingTokenForAll } = require("../utils/handler-token");
const { handlerGetAllUser } = require("../model/model-users");

const handlerTotalUser = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;

  try {
    const allUser = await handlerGetAllUser();
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
      data: {
        totalUser: allUser.length,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerTotalUser,
};
