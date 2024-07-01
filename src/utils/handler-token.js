const JWT = require('jsonwebtoken');
const {
  secretKey,
} = require('./secret.json');
const { handlerUserByNameMAL } = require('../model/model-users');

const createTokenAdmin = (dataToken) => {
  const data = {
    id_mal: dataToken?.id_mal,
    name_mal: dataToken?.name_mal,
  };

  return JWT.sign(data, secretKey, {
    expiresIn: '1d',
  });
};

const refreshTokenAdmin = (dataToken) => {
  const data = {
    id_mal: '',
    name_mal: '',
  };

  return JWT.sign(data, secretKey, {
    expiresIn: '5s',
  });
};

const checkingTokenForAll = async (credentials, token) => {
  const tokenSplit = token.split(' ');

  try {
    const userFind = await handlerUserByNameMAL(credentials?.name_mal);
    const currentTime = Math.floor(Date.now() / 1000);

    if (userFind.token !== tokenSplit[1]) {
      return {
        status: 'fail',
        message: 'Credentials tidak valid!',
      };
    }

    if (credentials.exp < currentTime) {
      return {
        status: 'fail',
        message: 'Token Expired',
      };
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  createTokenAdmin,
  refreshTokenAdmin,
  checkingTokenForAll,
};
