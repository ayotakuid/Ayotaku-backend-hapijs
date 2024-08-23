const {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
  handlerActivatedAccount,
  handlerProfileUser,
  handlerSignupUser,
} = require("./src/ayotaku-users/handler-users/handler-users");
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
          pathLimit: 5,
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
    method: 'POST',
    path: '/user/api/signup',
    handler: handlerSignupUser,
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 5,
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
    handler: handlerProfileUser,
    options: {
      auth: 'jwtUsers',
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 5,
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
    method: 'POST',
    path: '/user/api/active-email',
    handler: handlerActivatedAccount,
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 5,
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
];

module.exports = routesUser;
