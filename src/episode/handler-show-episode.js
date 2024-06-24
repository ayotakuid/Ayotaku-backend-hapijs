const { modelShowEpisode } = require('../model/model-episode-anime');
const { checkingTokenForAll } = require('../utils/handler-token');

const handlerShowAllEpisode = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    const responseModelShowEpisode = await modelShowEpisode();
    return h.response({
      status: 'success',
      message: `${responseModelShowEpisode.length} episode Anime berhasil diambil!`,
      data: responseModelShowEpisode,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerShowAllEpisode,
};
