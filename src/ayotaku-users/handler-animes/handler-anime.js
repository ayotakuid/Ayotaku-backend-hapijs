const { handlerModelUserlAggregateRecommend, handlerModelLastUpdate } = require("../../ayotaku-model-users/ayotaku-model-animes");
const { currentSeason } = require("../../utils/handler-tools");

const handlerUserGetRecommendAnime = async (request, h) => {
  const { max_recommend } = request.query;

  try {
    if (max_recommend > 10) {
      return h.response({
        status: 'fail',
        message: 'max_recommend tidak boleh lebih dari 10',
      }).code(400);
    }

    const responseModel = await handlerModelUserlAggregateRecommend();
    let sliceData;

    if (responseModel.length > 10) {
      sliceData = responseModel.slice(0, max_recommend);
      return h.response({
        status: 'success',
        message: 'data recommend anime',
        data: {
          total: sliceData.length,
          recommend: sliceData,
        },
      }).code(200);
    }

    return h.response({
      status: 'success',
      message: 'data recommend anime',
      data: {
        total: responseModel.length,
        recommend: responseModel,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan, coba lagi nanti',
    }).code(400);
  }
};

const handlerAnimeGetLastUpdate = async (request, h) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentFilterSeason = currentSeason(currentMonth);

  const {
    filterYear = new Date().getFullYear(),
    filterSeason = currentFilterSeason,
    limit = "10",
  } = request.query;

  try {
    const splitSeason = filterSeason.split(',');

    const isValid = splitSeason.every((item) => typeof item === 'string');
    if (!isValid) {
      return h.response({
        status: 'fail',
        message: 'Setiap item dalam season harus berupa string!',
      }).code(400);
    }

    const dataLastUpdate = await handlerModelLastUpdate(filterYear, splitSeason);
    const limitData = dataLastUpdate.slice(0, parseInt(limit, 10));

    return h.response({
      status: 'success',
      message: 'Anime berhasil diambil!',
      data: limitData,
    }).code(200);
  } catch (err) {
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan, coba lagi nanti!',
    }).code(400);
  }
};

module.exports = {
  handlerUserGetRecommendAnime,
  handlerAnimeGetLastUpdate,
};
