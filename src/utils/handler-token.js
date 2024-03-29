const JWT = require('jsonwebtoken');
const {
  secretKey,
} = require('./secret.json');

const createTokenAdmin = (dataToken) => {
  const data = {
    id_mal: dataToken?.id_mal,
    name_mal: dataToken?.name_mal,
    role: dataToken?.role,
  };

  return JWT.sign(data, secretKey, {
    expiresIn: '1d',
  });
};

const refreshTokenAdmin = (dataToken) => {
  const data = {
    id_mal: '',
    name_mal: '',
    role: '',
  };

  return JWT.sign(data, secretKey, {
    expiresIn: '5s',
  });
};

module.exports = {
  createTokenAdmin,
  refreshTokenAdmin,
};
