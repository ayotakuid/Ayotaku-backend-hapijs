const { handlerModelUserlAggregateRecommend } = require("../../ayotaku-model-users/ayotaku-model-animes");

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

module.exports = {
  handlerUserGetRecommendAnime,
};
