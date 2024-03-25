const JWT = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const axios = require('axios');
const {
  handlerGetToken,
  handlerGetFullProfileMAL,
} = require('../utils/handler-axios');
const { handlerUserByNameMAL } = require('../model/model-users');

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
  const tokenSplit = tokenUser.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser.name_mal);
    const currentTime = Math.floor(Date.now() / 1000);
    if (userFind.token !== tokenSplit[1]) {
      return h.response({
        status: 'fail',
        message: 'Credentials tidak valid!',
      }).code(401);
    }

    if (credentialsUser.exp < currentTime) {
      return h.response({
        status: 'fail',
        message: 'Token Expired',
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'Token tidak expired!',
      data: credentialsUser,
    }).code(200);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handlerCallbackFromMal,
  checkingTokenExp,
};
