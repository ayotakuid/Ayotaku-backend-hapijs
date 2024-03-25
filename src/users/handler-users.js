const JWT = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const axios = require('axios');
const {
  handlerGetToken,
  handlerGetFullProfileMAL,
} = require('../utils/handler-axios');

const handlerCallbackFromMal = async (request, h) => {
  const { code } = request.payload;

  try {
    const tokenFromMAL = await handlerGetToken(code);
    const responseData = await handlerGetFullProfileMAL(tokenFromMAL.access_token);

    const response = h.response({
      status: 'Success',
      message: 'Berhasil didapatkan',
      responseData,
    });
    response.code(200);
    return response;
  } catch (err) {
    const { data } = err.response;
    console.error(`Ada yang error di try catch`, err.response.data);
    const response = h.response({
      status: data.error,
      message: data.message,
    });
    response.code(err.response.status);
    return response;
  }
};

const checkingTokenExp = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;

  const response = h.response({
    status: 'success',
    message: 'Test Token',
    data: {
      credentialsUser,
      tokenUser,
    },
  });
  response.code(200);
  return response;
};

module.exports = {
  handlerCallbackFromMal,
  checkingTokenExp,
};
