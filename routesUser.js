const handlerErrorLimitRoutes = require("./src/error/handler-error-limit");
const { createTokenUsers } = require("./src/utils/handler-token");

const routesUser = [
  {
    method: ['POST', 'GET'],
    path: '/user/auth/google',
    handler: async (request, h) => {
      const { profile } = request.auth.credentials;
      try {
        const dataToken = JSON.stringify(profile.raw);
        return h.redirect(`/user/api/test?raw=${dataToken}`);
      } catch (err) {
        console.error('Terjadi error saat login google: ', err);
        return h.response({
          status: 'error',
          message: 'Terjadi kesalahan, Coba lagi.',
        }).code(500);
      }
    },
    options: {
      auth: 'google',
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 1,
          pathCache: {
            expiresIn: 10000,
          },
          authCache: {
            expiresIn: 5000,
          },
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/user/api/test',
    handler: async (request, h) => {
      const paramRaw = request.query.raw;
      return h.response({
        status: 'success',
        data: JSON.parse(paramRaw),
      }).code(200);
      // const credentialsUser = request.auth.credentials;
      // return h.response({
      //   status: 'berhasil',
      //   message: 'Damn man',
      //   data: credentialsUser,
      // }).code(200);
    },
    options: {
      auth: false,
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/coba',
    handler: async (request, h) => {
      const { response } = request;
      try {
        return h.response({
          status: 'success',
        }).code(200);
      } catch (err) {
        console.error('Terjadi error saat login google: ', err);
        return h.response({
          status: 'error',
          message: 'Terjadi kesalahan, Coba lagi.',
        }).code(500);
      }
    },
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
