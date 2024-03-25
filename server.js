const Hapi = require('@hapi/hapi');
const HapiJWT2 = require('hapi-auth-jwt2');
const routes = require('./routes');
const { secretKey } = require('./src/utils/secret.json');
const { connect } = require('./src/db/config');
const { handlerUserByNameMAL } = require('./src/model/model-users');

const validateToken = async (decoded, request, h) => {
  const { name_mal } = decoded;

  const user = await handlerUserByNameMAL(name_mal);

  if (!user) {
    return {
      isValid: false,
    };
  }

  return {
    isValid: true,
    credentials: decoded,
  };
};

const init = async () => {
  const server = Hapi.server({
    port: 9001,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://127.0.0.1:8000'],
        credentials: true,
      },
    },
  });

  await server.register(HapiJWT2);

  server.auth.strategy('jwt', 'jwt', {
    key: secretKey,
    validate: validateToken,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  await connect();

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
