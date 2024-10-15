const {
  handlerCheckingAnime,
  handlerSaveAnime,
  handlerModelManualEditAnime,
  handlerModelCheckingRecommend,
  handlerGetAllRecommend,
  handlerModelSaveRecommend,
  handlerModelManualEditRecommend,
} = require('../model/model-anime');
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
      }).code(400);
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
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerCreateRecommendAnime = async (request, h) => {
  const {
    id_anime,
    slug_anime,
    default_img,
    edit_img,
  } = request.payload;
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser.name_mal);
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);
    const dataRecommend = await handlerGetAllRecommend();

    if (!userFind) {
      return h.response({
        status: 'fail',
        message: 'Kamu loh siapa?',
      }).code(400);
    }

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    if (dataRecommend.length === 20) {
      return h.response({
        status: 'fail',
        message: 'Data Recommend Anime sudah max!',
      }).code(400);
    }

    const checkingDataRecommend = await handlerModelCheckingRecommend(id_anime);

    if (checkingDataRecommend) {
      return h.response({
        status: 'fail',
        message: 'Anime sudah ada!',
      }).code(400);
    }

    const newRecommend = {
      id_anime,
      slug_anime,
      default_img,
      edit_img,
    };

    const saveRecommendAnime = await handlerModelSaveRecommend(newRecommend);
    return h.response({
      status: 'success',
      message: 'Anime Recommend success added!',
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerManualEditRecommend = async (request, h) => {
  const { recommendUuid, imageURL } = request.payload;
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

    const dataNeeded = {
      image: imageURL,
    };
    const responseUpdateRecommend = await handlerModelManualEditRecommend(recommendUuid, dataNeeded);

    if (!responseUpdateRecommend.status) {
      return h.response({
        status: 'fail',
        message: 'Data gagal diupdate!',
      }).code(400);
    }

    return h.response({
      status: 'success',
      message: 'Data berhasil diupdate!',
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerCreateAnime,
  handlerManualEditAnime,
  handlerCreateRecommendAnime,
  handlerManualEditRecommend,
};
