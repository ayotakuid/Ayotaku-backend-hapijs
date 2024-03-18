const { handlerViewUsers, handlerLoginAdmin, handlerCallbackFromMal } = require("./src/users/handler-users");

const routes = [
  {
    method: 'GET',
    path: '/api/admin/callback',
    handler: handlerCallbackFromMal,
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
