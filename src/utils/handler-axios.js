const axios = require('axios');
const {
  MAL_URI_TOKEN,
  MAL_CLIENT_ID,
  CLIENT_SECRET,
  CODE_VERIFIER,
  GRANT_TYPE,
  MAL_URI_PROFILE,
  MAL_API_URI,
  ANIME_SCHEDULE_URI,
  ANIME_SCHEDULE_TOKEN,
  FIELDS_DETAIL_ANIME,
  JIKAN_API_URI,
} = require('./secret.json');
const {
  handlerSaveUsers,
  handlerUserByNameMAL,
  handlerUpdateLoginUsers,
} = require('../model/model-users');
const { createTokenAdmin } = require('./handler-token');
const { handlerSaveLogsUser } = require('../model/model-logs');

const handlerGetToken = async (code) => {
  try {
    const responseToken = await axios.post(MAL_URI_TOKEN, {
      client_id: MAL_CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      code_verifier: CODE_VERIFIER,
      grant_type: GRANT_TYPE,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return responseToken.data;
  } catch (err) {
    const { data } = err.response;
    return {
      status: data.error,
      message: data.message,
    };
  }
};

const handlerGetFullProfileMAL = async (tokenMAL) => {
  try {
    const configAxios = {
      method: 'GET',
      maxBodyLength: Infinity,
      url: MAL_URI_PROFILE,
      headers: {
        Authorization: `Bearer ${tokenMAL}`,
      },
    };

    const { data } = await axios.request(configAxios);
    const checkingUsers = await handlerUserByNameMAL(data.name);
    const tokenAyotaku = createTokenAdmin({
      id_mal: data.id,
      name_mal: data.name,
    });

    if (checkingUsers !== null) {
      const fields = {
        id_mal: data.id,
        name_mal: data.name,
        img_profile: data.picture,
        token_mal: tokenMAL,
      };
      const updatelogin = await handlerUpdateLoginUsers(fields, tokenAyotaku);
      await handlerSaveLogsUser(checkingUsers, 'signin-admin');
      fields.role = updatelogin.role;
      const responseData = {
        ...fields,
        tokenAyotaku,
      };
      return responseData;
    }

    const fields = {
      id_mal: data.id,
      name_mal: data.name,
      img_profile: data.picture,
      token_mal: tokenMAL,
      role: 'user',
    };
    await handlerSaveUsers(fields, tokenAyotaku);
    await handlerSaveLogsUser(fields, 'signup');
    const responseData = {
      ...fields,
      tokenAyotaku,
    };

    return responseData;
  } catch (err) {
    console.error('Terjadi kesalahan saat GET Profile', err);
    return err;
  }
};

const handlerFethcingScheduleWeek = async () => {
  const headersSChedule = new Headers();
  headersSChedule.append("Content-Type", "application/json");
  headersSChedule.append("Authorization", `Bearer ${ANIME_SCHEDULE_TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: headersSChedule,
    redirect: "follow",
  };

  try {
    const scheduleWeeks = await fetch(`${ANIME_SCHEDULE_URI}/timetables/sub?tz=Asia/Jakarta`, requestOptions);

    if (scheduleWeeks.ok) {
      const result = await scheduleWeeks.json();
      const daysNames = [
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
      ];
      const groups = {};

      result.forEach((anime) => {
        const date = new Date(anime.episodeDate);
        const dayName = daysNames[date.getDay()];

        if (!groups[dayName]) {
          groups[dayName] = [];
        }

        groups[dayName].push(anime);
      });

      return groups;
    }

    return {
      message: 'Schedule Error!',
    };
  } catch (err) {
    console.log('Error disini');
    console.error(err);
    throw err;
  }
};

const handlerFetchingSearchAnime = async (tokenMal, nameAnime) => {
  const headersSearchAnime = new Headers();
  headersSearchAnime.append("Content-Type", "application/json");
  headersSearchAnime.append("Authorization", `Bearer ${tokenMal}`);

  const requestOptions = {
    method: "GET",
    headers: headersSearchAnime,
    redirect: "follow",
  };

  try {
    const searchAnime = await fetch(`${MAL_API_URI}/anime?q=${nameAnime}&nsfw=true`, requestOptions);
    const result = await searchAnime.json();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerFetchingDetailAnime = async (tokenMal, id) => {
  const headersDetailAnime = new Headers();
  headersDetailAnime.append("Content-Type", "application/json");
  headersDetailAnime.append("Authorization", `Bearer ${tokenMal}`);

  const requestOptions = {
    method: 'GET',
    headers: headersDetailAnime,
    redirect: "follow",
  };

  try {
    const detailAnime = await fetch(`${MAL_API_URI}/anime/${id}?fields=${FIELDS_DETAIL_ANIME}`, requestOptions);
    const result = await detailAnime.json();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerFetchingAnimeVideoJikan = async (id) => {
  const headerVideoJikan = new Headers();
  headerVideoJikan.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'GET',
    headers: headerVideoJikan,
    redirect: "follow",
  };

  try {
    const animeVideo = await fetch(`${JIKAN_API_URI}/anime/${id}/videos`, requestOptions);
    const result = await animeVideo.json();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerGetToken,
  handlerGetFullProfileMAL,
  handlerFethcingScheduleWeek,
  handlerFetchingSearchAnime,
  handlerFetchingDetailAnime,
  handlerFetchingAnimeVideoJikan,
};
