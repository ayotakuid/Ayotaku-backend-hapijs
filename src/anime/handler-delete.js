const {
  handlerModelSoftDelete,
  handlerModelRecoveryAnime,
  handlerModelDeleteRecommend,
} = require('../model/model-anime');
const { handlerUserByNameMAL } = require('../model/model-users');
const { checkingTokenForAll } = require('../utils/handler-token');

const handlerSoftDeleteByUuid = async (request, h) => {
  const { animeUuid } = request.payload;
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

    const softDelete = await handlerModelSoftDelete(animeUuid);

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

const handlerRecoveryAnime = async (request, h) => {
  const { animeUuid } = request.payload;
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

    const recoveryAnime = await handlerModelRecoveryAnime(animeUuid);

    if (recoveryAnime.modifiedCount === 0) {
      return h.response({
        status: 'fail',
        message: 'UUID Tidak ada yang cocok',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Berhasil di recovery',
      data: recoveryAnime,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerHardDeleteRecommend = async (request, h) => {
  const { id_anime } = request.payload;
  const credentialsUsers = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentialsUsers.name_mal);
    const isExpired = await checkingTokenForAll(credentialsUsers, tokenUser);

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    if (userFind.role !== 'admin') {
      return h.response({
        status: 'fail',
        message: 'Kami tidak berhak!',
      }).code(401);
    }

    const hardDeleteRecommend = await handlerModelDeleteRecommend(id_anime);

    if (!hardDeleteRecommend.status) {
      return h.response({
        status: 'fail',
        message: 'Failed delete Recommend anime',
      }).code(400);
    }

    return h.response({
      status: 'success',
      message: 'Success delete Recommend anime',
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerSoftDeleteByUuid,
  handlerRecoveryAnime,
  handlerHardDeleteRecommend,
};
