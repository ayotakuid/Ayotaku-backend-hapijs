const {
  handlerUserGetRecommendAnime,
  handlerAnimeGetLastUpdate,
  handlerAnimeSuggested,
  handlerAnimeGetPagination,
} = require("./src/ayotaku-users/handler-animes/handler-anime");
const { handlerSendLinkResetPassword, handlerValidateSessionReset, handlerFormResetPassword } = require("./src/ayotaku-users/handler-reset-password/handler-reset");
const {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
  handlerActivatedAccount,
  handlerProfileUser,
  handlerSignupUser,
  handlerSignInUser,
  handlerUpdateDisplayUsername,
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
    method: 'POST',
    path: '/user/api/signin',
    handler: handlerSignInUser,
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
          pathLimit: 20,
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
  {
    method: 'PUT',
    path: '/user/api/profile',
    handler: handlerUpdateDisplayUsername,
    options: {
      auth: 'jwtUsers',
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 50,
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
    path: '/user/api/ticket/reset',
    handler: handlerSendLinkResetPassword,
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
    path: '/user/api/ticket',
    handler: handlerValidateSessionReset,
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
    method: 'PUT',
    path: '/user/api/ticket/reset',
    handler: handlerFormResetPassword,
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
    method: 'GET',
    path: '/user/api/anime/recommend',
    handler: handlerUserGetRecommendAnime,
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 50,
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
    path: '/user/api/anime/last',
    handler: handlerAnimeGetLastUpdate,
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 50,
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
    path: '/user/api/anime/suggest',
    handler: handlerAnimeSuggested,
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 50,
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
    path: '/user/api/anime',
    handler: handlerAnimeGetPagination,
    options: {
      auth: false,
      cors: true,
      plugins: {
        'hapi-rate-limit': {
          pathLimit: 50,
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
