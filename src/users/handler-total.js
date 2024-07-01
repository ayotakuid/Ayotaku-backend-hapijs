const { checkingTokenForAll } = require("../utils/handler-token");
const {
  handlerGetAllUser,
  handlerGetOnlineUser,
} = require("../model/model-users");
const { handlerModelGetAllAnime } = require("../model/model-anime");
const { modelGetAllEpisode } = require("../model/model-episode-anime");

const handlerTotalUser = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;

  try {
    const allUser = await handlerGetAllUser();
    const allAnime = await handlerModelGetAllAnime();
    const allEpisode = await modelGetAllEpisode();
    const onlineUser = await handlerGetOnlineUser();
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
        totalAnime: allAnime.length,
        totalEpisode: allEpisode.length,
        onlineUser: onlineUser.length,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerTotalUser,
};
