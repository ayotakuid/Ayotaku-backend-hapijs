const {
  handlerCallbackFromMal,
  checkingTokenExp,
  handlerSignOutAdmin,
  handlerGetProfileUser,
} = require("./src/users/handler-users");
const { handlerTotalUser } = require("./src/users/handler-total");
const { handlerLogs } = require("./src/logs/handler-logs");
const { handlerFethcingScheduleWeek } = require("./src/utils/handler-axios");
const { handlerSearchAnime, handlerDetailAnime } = require("./src/anime/handler-search");
const { handlerCreateAnime } = require("./src/anime/handler-create");
const { handlerShowAllAnime, handlerShowDeleteAnime } = require("./src/anime/handler-show");
const { handlerSoftDeleteByUuid } = require("./src/anime/handler-delete");

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
  {
    method: 'POST',
    path: '/api/anime/search',
    handler: handlerSearchAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/api/anime/mal/{id}/detail',
    handler: handlerDetailAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/api/anime/create',
    handler: handlerCreateAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/all',
    handler: handlerShowAllAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'DELETE',
    path: '/api/anime/delete',
    handler: handlerSoftDeleteByUuid,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/all/delete',
    handler: handlerShowDeleteAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
];

module.exports = routes;
