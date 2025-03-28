const {
  handlerCallbackFromMal,
  checkingTokenExp,
  handlerSignOutAdmin,
  handlerGetProfileUser,
  handlerGetAllUser,
  handlerUpdateRoleUser,
} = require("./src/users/handler-users");
const { handlerTotalUser } = require("./src/users/handler-total");
const { handlerLogs } = require("./src/logs/handler-logs");
const { handlerFethcingScheduleWeek } = require("./src/utils/handler-axios");
const { handlerSearchAnime, handlerDetailAnime, handlerSearchAnimeDatabase } = require("./src/anime/handler-search");
const {
  handlerCreateAnime,
  handlerManualEditAnime,
  handlerCreateRecommendAnime,
  handlerManualEditRecommend,
} = require("./src/anime/handler-create");
const {
  handlerShowAllAnime,
  handlerShowDeleteAnime,
  handlerSyncAnime,
  handlerGetRecommendAnime,
} = require("./src/anime/handler-show");
const { handlerSoftDeleteByUuid, handlerRecoveryAnime, handlerHardDeleteRecommend } = require("./src/anime/handler-delete");
const { handlerCreateEpisode, handlerEditEpisode } = require("./src/episode/handler-create-episode");
const { handlerShowAllEpisode } = require("./src/episode/handler-show-episode");
const { handlerSoftDeleteEpisode, handlerShowDeleteEpisode, handlerRecoveryEpisode } = require("./src/episode/handler-episode-delete");

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
  {
    method: 'PUT',
    path: '/api/anime/recovery',
    handler: handlerRecoveryAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/anime/sync-anime',
    handler: handlerSyncAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/anime/manual-edit',
    handler: handlerManualEditAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/api/anime/episode/add',
    handler: handlerCreateEpisode,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/episode/all',
    handler: handlerShowAllEpisode,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'DELETE',
    path: '/api/anime/episode/delete',
    handler: handlerSoftDeleteEpisode,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/episode/delete',
    handler: handlerShowDeleteEpisode,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/anime/episode/recovery',
    handler: handlerRecoveryEpisode,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/anime/episode/edit',
    handler: handlerEditEpisode,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/users',
    handler: handlerGetAllUser,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/users/role/update',
    handler: handlerUpdateRoleUser,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/searchAnime',
    handler: handlerSearchAnimeDatabase,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/api/anime/recommend',
    handler: handlerCreateRecommendAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'GET',
    path: '/api/anime/recommend',
    handler: handlerGetRecommendAnime,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'DELETE',
    path: '/api/anime/recommend',
    handler: handlerHardDeleteRecommend,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/api/anime/recommend',
    handler: handlerManualEditRecommend,
    options: {
      auth: 'jwt',
      cors: true,
    },
  },
];

module.exports = routes;
