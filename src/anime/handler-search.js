const { handlerUserByNameMAL } = require("../model/model-users");
const { handlerFetchingSearchAnime } = require("../utils/handler-axios");
const { checkingTokenForAll } = require("../utils/handler-token");

const handlerSearchAnime = async (request, h) => {
  const { nama_anime } = request.payload;
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

    const fetchingSearchAnime = await handlerFetchingSearchAnime(userFind?.token_mal, nama_anime);

    return h.response({
      status: 'success',
      message: `hasil pencarian: ${nama_anime}`,
      data: fetchingSearchAnime,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerSearchAnime,
};
