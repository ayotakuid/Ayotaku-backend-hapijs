const { createTokenUsers } = require("./src/utils/handler-token");

const routesUser = [
  {
    method: 'GET',
    path: '/user/api',
    handler: (request, h) => {
      const authenticated = request.auth;
      return h.response({
        status: 'success',
        message: 'test',
        data: authenticated,
      }).code(200);
    },
    options: {
      auth: false,
      cors: true,
    },
  },
  {
    method: ['POST', 'GET'],
    path: '/auth/google',
    handler: async (request, h) => {
      const { profile } = request.auth.credentials;
      const dataToken = profile.raw;
      const createToken = createTokenUsers(dataToken);
      return h.response({
        status: 'success',
        data: createToken,
      }).code(200);
    },
    options: {
      auth: 'google',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/user/api/test',
    handler: async (request, h) => {
      const credentialsUser = request.auth.credentials;
      return h.response({
        status: 'berhasil',
        message: 'Damn man',
        data: credentialsUser,
      }).code(200);
    },
    options: {
      auth: 'jwtUsers',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/coba',
    handler: async (request, h) => h.response({ status: 'success' }).code(200),
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 1,
          pathCache: {
            expiresIn: 5000,
          },
          authCache: {
            expiresIn: 5000,
          },
        },
      },
    },
  },
];

module.exports = routesUser;
