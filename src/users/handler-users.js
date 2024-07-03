const JWT = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const axios = require('axios');
const {
  handlerGetToken,
  handlerGetFullProfileMAL,
} = require('../utils/handler-axios');
const { handlerUserByNameMAL, handlerUpdateSignOutUsers, handlerShowUsers } = require('../model/model-users');
const { refreshTokenAdmin, checkingTokenForAll } = require('../utils/handler-token');
const { handlerSaveLogsUser } = require('../model/model-logs');

const handlerCallbackFromMal = async (request, h) => {
  const { code } = request.payload;

  try {
    const tokenFromMAL = await handlerGetToken(code);
    const responseData = await handlerGetFullProfileMAL(tokenFromMAL.access_token);

    const response = h.response({
      status: 'success',
      message: 'Berhasil didapatkan',
      responseData,
    });
    response.code(200);
    return response;
  } catch (err) {
    const { data } = err.response;
    console.error(`Ada yang error di try catch`, err.response.data);
    const response = h.response({
      status: data.error,
      message: data.message,
    });
    response.code(err.response.status);
    return response;
  }
};

const checkingTokenExp = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser.name_mal);
    const currentTime = Math.floor(Date.now() / 1000);
    if (userFind.token !== tokenSplit[1]) {
      return h.response({
        status: 'fail',
        message: 'Credentials tidak valid!',
      }).code(401);
    }

    if (credentialsUser.exp < currentTime) {
      return h.response({
        status: 'fail',
        message: 'Token Expired',
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'Token tidak expired!',
      data: credentialsUser,
    }).code(200);
  } catch (err) {
    console.error(err);
  }
};

const handlerSignOutAdmin = async (request, h) => {
  const credentialsUser = request.auth.credentials;

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser.name_mal);
    const fields = {
      id_mal: userFind?.id_mal,
      name_mal: userFind?.name_mal,
      role: userFind?.role,
    };
    const refreshToken = refreshTokenAdmin(fields);
    const updateSignOut = await handlerUpdateSignOutUsers(fields, refreshToken);
    await handlerSaveLogsUser(userFind, 'signout-admin');

    if (updateSignOut.matchedCount !== 1) {
      return h.response({
        status: 'fail',
        message: 'Data tidak di temukan',
      }).code(400);
    }
    const response = h.response({
      status: 'success',
      message: 'Data berhasil diedit',
    });
    response.code(200);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerGetProfileUser = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser?.name_mal);
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (isExpired !== true) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    return h.response({
      status: 'success',
      message: 'Profile berhasil diambil!',
      data: {
        id_mal: userFind?.id_mal,
        name_mal: userFind?.name_mal,
        img_profile: userFind?.img_profile,
        isLogin: userFind?.isLogin,
        timeLogin: userFind?.timeLogin,
        role: userFind?.role,
      },
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerGetAllUser = async (request, h) => {
  const credentialsUser = request.auth.credentials;
  const tokenUser = request.headers.authorization;
  const tokenSplit = tokenUser.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentialsUser.name_mal);
    const isExpired = await checkingTokenForAll(credentialsUser, tokenUser);

    if (!isExpired) {
      return h.response({
        status: isExpired?.status,
        message: isExpired?.message,
      }).code(401);
    }

    if (userFind.role !== 'admin') {
      return h.response({
        status: 'fail',
        message: 'Kamu tidak berhak akses ini!',
      }).code(401);
    }

    const responseModel = await handlerShowUsers();
    return h.response({
      status: 'success',
      message: 'Berhasil mendapatkan data Users!',
      data: responseModel,
    }).code(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerCallbackFromMal,
  checkingTokenExp,
  handlerSignOutAdmin,
  handlerGetProfileUser,
  handlerGetAllUser,
};
