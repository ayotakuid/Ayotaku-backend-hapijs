const JWT = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const axios = require('axios');
const {
  secretKey,
} = require('../utils/secret.json');
const {
  handlerGetToken,
  handlerGetFullProfileMAL,
} = require('../utils/handler-axios');

const createToken = (user) => {
  const data = {
    id: 123,
    name_mal: user.username,
  };

  return JWT.sign(data, secretKey, {
    expiresIn: '1d',
  });
};

const handlerViewUsers = (request, h) => {
  const response = h.response({
    status: 'success',
    message: 'Halo Halo users!',
  });
  response.code(200);
  return response;
};

const handlerLoginAdmin = (request, h) => {
  const { username } = request.payload;

  const response = h.response({
    status: 'success',
    message: 'Success Login',
    data: {
      _user: {
        token: createToken(request.payload),
      },
    },
  });
  response.code(200);
  return response;
};

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

module.exports = {
  handlerViewUsers,
  handlerLoginAdmin,
  handlerCallbackFromMal,
};
