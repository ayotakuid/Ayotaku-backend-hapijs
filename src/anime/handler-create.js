const { handlerCheckingAnime, handlerSaveAnime, handlerModelManualEditAnime } = require('../model/model-anime');
const { handlerUserByNameMAL } = require('../model/model-users');
const { checkingTokenForAll } = require('../utils/handler-token');

const handlerCreateAnime = async (request, h) => {
  const data = request.payload;
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser.name_mal);
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    const checking = await handlerCheckingAnime(data.id_anime);

    if (checking.length !== 0) {
      return h.response({
        status: 'fail',
        message: 'Anime sudah ada!',
      }).code(401);
    }

    const insertAnime = await handlerSaveAnime(data, credentialsUser.id_mal);
    return h.response({
      status: 'success',
      message: 'Anime berhasil ditambah!',
      data: insertAnime,
    }).code(200);
  } catch (err) {
    console.error(err);
  }
};

const handlerManualEditAnime = async (request, h) => {
  const { animeUuid, imageUrl, videoUrl } = request.payload;
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

    const allDataNeeded = {
      image: imageUrl,
      video: videoUrl,
    };
    const responseUpdateManual = await handlerModelManualEditAnime(animeUuid, allDataNeeded);
    return h.response({
      status: 'success',
      message: 'Data berhasil diedit!',
      data: responseUpdateManual,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerCreateAnime,
  handlerManualEditAnime,
};
