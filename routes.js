const {
  handlerCallbackFromMal,
  checkingTokenExp,
  handlerSignOutAdmin,
  handlerGetProfileUser,
} = require("./src/users/handler-users");
const { handlerTotalUser } = require("./src/users/handler-total");
const { handlerLogs } = require("./src/logs/handler-logs");
const { handlerFethcingScheduleWeek } = require("./src/utils/handler-axios");

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
  {
    method: 'GET',
    path: '/api/admin/total-all',
    handler: handlerTotalUser,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/admin/logs',
    handler: handlerLogs,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/schedule',
    handler: handlerFethcingScheduleWeek,
    options: {
      auth: false,
      cors: true,
    },
  },
];

module.exports = routes;
