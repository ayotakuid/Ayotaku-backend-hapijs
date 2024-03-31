const {
  handlerCallbackFromMal,
  checkingTokenExp,
  handlerSignOutAdmin,
  handlerGetProfileUser,
} = require("./src/users/handler-users");

const routes = [
  {
    method: 'POST',
    path: '/api/admin/callback',
    handler: handlerCallbackFromMal,
    options: {
      auth: false,
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/api/check-token',
    handler: checkingTokenExp,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/api/admin/signout',
    handler: handlerSignOutAdmin,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/admin/profile',
    handler: handlerGetProfileUser,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
];

module.exports = routes;
