const {
  handlerModelUserlAggregateRecommend,
  handlerModelLastUpdate,
  handlerModelSuggestedGet,
  handlerModelSuggestedInsert,
  handlerModelAnimePagination,
} = require("../../ayotaku-model-users/ayotaku-model-animes");
const { currentSeason, previousSeason, checkingPreviousSeason } = require("../../utils/handler-tools");
const { checkingDateSuggested, formatDateForSuggested } = require('../../utils/handler-moment');

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

  // INI SANGAT PENTING UNTUK DI INGAT KARENA INI UNTUK KENDALIKAN MUNCUL ATAU TIDAKNYA DATA ANIME
  const {
    filterYear = new Date().getFullYear().toString(),
    filterSeason = currentFilterSeason,
    limit = "10",
  } = request.query;

  try {
    const splitSeason = filterSeason.split(',');
    const splitYear = filterYear.split(',').map((year) => parseInt(year, 10));
    const filterPreviousSeason = previousSeason(currentFilterSeason);
    const checkingPrevSeason = checkingPreviousSeason(splitSeason.map((item) => item.toLowerCase()), filterPreviousSeason);

    const isValid = splitSeason.every((item) => typeof item === 'string');
    if (!isValid) {
      return h.response({
        status: 'fail',
        message: 'Setiap item dalam season harus berupa string!',
      }).code(400);
    }

    const dataLastUpdate = await handlerModelLastUpdate(splitYear, checkingPrevSeason);
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

const handlerAnimeSuggested = async (request, h) => {
  try {
    const suggestedDate = await formatDateForSuggested();
    const oneOfDateSuggest = await handlerModelSuggestedGet();
    const checking = await checkingDateSuggested(new Date(oneOfDateSuggest[0].refreshDate));

    if (!checking.status) {
      return h.response({
        status: 'success',
        message: 'Belum waktunya refresh suggested anime',
        data: oneOfDateSuggest,
      }).code(200);
    }

    await handlerModelSuggestedInsert();
    return h.response({
      status: 'success',
      message: 'Berhasil refresh Suggested Anime',
      data: oneOfDateSuggest,
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan, coba lagi nanti!',
    }).code(400);
  }
};

const handlerAnimeGetPagination = async (request, h) => {
  try {
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 18;
    const skip = (page - 1) * limit;

    const fromModel = await handlerModelAnimePagination({ skip, limit });
    return h.response({
      status: 'success',
      message: 'Data Anime Pagination',
      data: fromModel.dataPagination,
      pagination: {
        totalData: fromModel.pagination.totalData,
        totalPages: fromModel.pagination.totalPages,
        currentPages: page,
        perParge: limit,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan di Pagination!',
    }).code(400);
  }
};

module.exports = {
  handlerUserGetRecommendAnime,
  handlerAnimeGetLastUpdate,
  handlerAnimeSuggested,
  handlerAnimeGetPagination,
};
