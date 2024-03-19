const axios = require('axios');
const {
  MAL_URI_TOKEN,
  MAL_CLIENT_ID,
  CLIENT_SECRET,
  CODE_VERIFIER,
  GRANT_TYPE,
  MAL_URI_PROFILE,
} = require('./secret.json');

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
    console.log(data);
    return {
      users: data,
    };
  } catch (err) {
    console.error('Terjadi kesalahan saat GET Profile', err);
    return err;
  }
};

module.exports = {
  handlerGetToken,
  handlerGetFullProfileMAL,
};
