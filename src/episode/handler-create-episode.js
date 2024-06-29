const { handlerUserByNameMAL } = require('../model/model-users');
const { checkingTokenForAll } = require('../utils/handler-token');
const { modelSaveEpisode, modelEditEpisode } = require('../model/model-episode-anime');
const { createSlugEpisode } = require('../utils/handler-slug');

const handlerCreateEpisode = async (request, h) => {
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

    if (!data?.uuidAnime) {
      return h.response({
        status: 'fail',
        message: 'Tolong isi semua field',
      }).code(422);
    }

    if (!data?.uuidAdmin) {
      return h.response({
        status: 'fail',
        message: 'Tolong isi semua field',
      }).code(422);
    }

    if (!data?.episode) {
      return h.response({
        status: 'fail',
        message: 'Tolong isi semua field',
      }).code(422);
    }

    const allDataNeeded = {
      id_anime: data?.uuidAnime,
      id_admin: data?.uuidAdmin,
      slugEps: createSlugEpisode(data?.episode),
      episode: data?.episode,
      link_stream: {
        resol720: data?.stream?.resol720,
        resol1080: data?.stream?.resol1080,
      },
      link_download: {
        resol720: data?.download?.resol720,
        resol1080: data?.download?.resol1080,
      },
    };

    const insertEpisode = await modelSaveEpisode(allDataNeeded);
    return h.response({
      status: 'success',
      message: 'Berhasil tambah episode!',
      data: insertEpisode,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerEditEpisode = async (request, h) => {
  const { episodeUuid, dataEpisode, checkingEpisode } = request.payload;
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

    const responseModelUpdate = await modelEditEpisode(episodeUuid, dataEpisode, checkingEpisode);
    return h.response({
      status: 'success',
      message: 'Data berhasil diedit!',
      data: responseModelUpdate,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerCreateEpisode,
  handlerEditEpisode,
};
