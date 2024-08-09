const { handlerGoogleLoginUsers, handlerCallbackAfterLoginGoogle, sendCodeVerificationUser } = require("./src/ayotaku-users/handler-users/handler-users");
const { createTokenUsers } = require("./src/utils/handler-token");

const routesUser = [
  {
    method: ['POST', 'GET'],
    path: '/user/auth/google',
    handler: handlerGoogleLoginUsers,
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
    path: '/user/api/google/callback',
    handler: handlerCallbackAfterLoginGoogle,
    options: {
      auth: false,
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
    path: '/user/api/profile',
    handler: async (request, h) => {
      const credentialsUser = request.auth.credentials;
      return h.response({
        status: 'success',
        data: credentialsUser,
      }).code(200);
    },
    options: {
      auth: 'jwtUsers',
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
  {
    method: 'GET',
    path: '/user/email/send',
    handler: sendCodeVerificationUser,
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
