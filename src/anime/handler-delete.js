const { handlerModelSoftDelete } = require('../model/model-anime');
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
        status: 'failed',
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

module.exports = {
  handlerSoftDeleteByUuid,
};
