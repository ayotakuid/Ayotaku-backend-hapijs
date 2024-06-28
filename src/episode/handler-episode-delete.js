const { modelSoftDeleteEpisode, modelShowEpisodeDelete, modelRecoveryEpisode } = require("../model/model-episode-anime");
const { checkingTokenForAll } = require("../utils/handler-token");

const handlerSoftDeleteEpisode = async (request, h) => {
  const { episodeUuid } = request.payload;
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401); // authorization failed
    }

    const softDelete = await modelSoftDeleteEpisode(episodeUuid);

    if (softDelete.modifiedCount === 0) {
      return h.response({
        status: 'fail',
        message: 'UUID Tidak ada yang cocok',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Berhasil di delete',
      data: softDelete,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerShowDeleteEpisode = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (!isExpired) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    const showEpisodeDelete = await modelShowEpisodeDelete();
    return h.response({
      status: 'success',
      message: `${showEpisodeDelete.length} episode anime berhasil diambil!`,
      data: showEpisodeDelete,
    }).code(200);
  } catch (err) {
    console.error('Error Show Delete Episode: ', err);
    throw err;
  }
};

const handlerRecoveryEpisode = async (request, h) => {
  const { episodeUuid } = request.payload;
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (!isExpired) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    const recoverEpisode = await modelRecoveryEpisode(episodeUuid);

    if (recoverEpisode.modifiedCount === 0) {
      return h.response({
        status: 'fail',
        message: 'UUID Episode tidak ada yang cocok',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Berhasil di recovery',
      data: recoverEpisode,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerSoftDeleteEpisode,
  handlerShowDeleteEpisode,
  handlerRecoveryEpisode,
};
