const JWT = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const { secretKey, MAL_URI_TOKEN } = require('../utils/secret.json');
// const axios = require('axios').default;

const createToken = (user) => {
  const data = {
    id: 123,
    username: user.username,
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

const handlerCallbackFromMal = (request, h) => {
  const { code } = request.query;

  // try {
  //   axios(`${MAL_URI_TOKEN}?response_type=code&client_id?`)
  // }
};

module.exports = {
  handlerViewUsers,
  handlerLoginAdmin,
  handlerCallbackFromMal,
};
