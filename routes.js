const { handlerViewUsers, handlerLoginAdmin, handlerCallbackFromMal } = require("./src/users/handler-users");

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
];

module.exports = routes;
