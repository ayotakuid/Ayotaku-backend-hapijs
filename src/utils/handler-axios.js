const axios = require('axios');
const {
  MAL_URI_TOKEN,
  MAL_CLIENT_ID,
  CLIENT_SECRET,
  CODE_VERIFIER,
  GRANT_TYPE,
  MAL_URI_PROFILE,
} = require('./secret.json');
const { handlerSaveUsers, handlerUserByNameMAL, handlerUpdateLoginUsers } = require('../model/model-users');
const { createTokenAdmin } = require('./handler-token');

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
    const fields = {
      id_mal: data.id,
      name_mal: data.name,
      img_profile: data.picture,
      token_mal: tokenMAL,
      role: 'user',
    };
    const tokenAyotaku = createTokenAdmin(fields);

    if (checkingUsers !== null) {
      const updatelogin = await handlerUpdateLoginUsers(fields, tokenAyotaku);
      console.log(updatelogin);
      return fields;
    }

    await handlerSaveUsers(fields, tokenAyotaku);

    return fields;
  } catch (err) {
    console.error('Terjadi kesalahan saat GET Profile', err);
    return err;
  }
};

module.exports = {
  handlerGetToken,
  handlerGetFullProfileMAL,
};
