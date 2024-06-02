const { handlerModelShowAnime, handlerModelShowAnimeDelete } = require('../model/model-anime');
const { handlerUserByNameMAL } = require('../model/model-users');
const { checkingTokenForAll } = require('../utils/handler-token');

const handlerShowAllAnime = async (request, h) => {
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
      }).code(401); // authorization failed
    }

    const modelShowAnime = await handlerModelShowAnime();
    return h.response({
      status: 'success',
      message: `${modelShowAnime.length} judul Anime berhasil diambil!`,
      data: modelShowAnime,
    }).code(200); // get success
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerShowDeleteAnime = async (request, h) => {
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

    const modelShowDelete = await handlerModelShowAnimeDelete();
    return h.response({
      status: 'success',
      message: `${modelShowDelete.length} judul Anime berhasil diambil!`,
      data: modelShowDelete,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerShowAllAnime,
  handlerShowDeleteAnime,
};
