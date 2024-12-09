const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');
const HapiJWT2 = require('hapi-auth-jwt2');
const HapiRateLimit = require('hapi-rate-limit');
const routes = require('./routes');
const routesUser = require('./routesUser');
const {
  secretKey,
  secretKeyUser,
  PASSWORD_STRATEGY_GOOGLE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require('./src/utils/secret.json');
const { connect } = require('./src/db/config');
const { handlerUserByNameMAL } = require('./src/model/model-users');
const { findUserForValidateToken } = require('./src/ayotaku-model-users/ayotaku-model-users');

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

const validateTokenUsers = async (decoded, request, h) => {
  const responseValidate = await findUserForValidateToken(decoded);

  if (!responseValidate.data) {
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
        origin: ['http://127.0.0.1:8000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5500'],
        credentials: true,
      },
    },
  });

  await server.register(HapiJWT2);
  await server.register(Bell);
  await server.register({
    plugin: HapiRateLimit,
    options: {
      userLimit: 20,
      pathLimit: false,
      userCache: {
        expiresIn: 5000,
      },
      pathCache: {
        expiresIn: 5000,
        getDecoratedValue: true,
        segment: 'hapi-rate-limit-path',
      },
      authCache: {
        expiresIn: 5000,
        getDecoratedValue: true,
        segment: 'hapi-rate-limit-auth',
      },
    },
  });

  server.events.on('response', (request) => {
    const limit = request.plugins['hapi-rate-limit'];
    if (limit) {
      // console.log(limit);
    }
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response.isBoom && response.output.statusCode === 429) {
      return h.response({
        status: 'error',
        statusCode: 429,
        message: 'Terlalu banyak request, coba lagi nanti!',
      }).code(429);
    }

    if (response.isBoom) {
      const { output } = response;

      if (output.statusCode === 500) {
        return h.redirect('/user/auth/google');
      }
    }

    return h.continue;
  });

  server.auth.strategy('jwt', 'jwt', {
    key: secretKey,
    validate: validateToken,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.strategy('jwtUsers', 'jwt', {
    key: secretKeyUser,
    validate: validateTokenUsers,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: PASSWORD_STRATEGY_GOOGLE,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    isSecure: false,
    location: server.info.uri,
  });

  server.auth.default('jwt');

  await connect();

  server.route(routes);
  server.route(routesUser);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});

// server.auth.strategy('google', 'bell', {
//   provider: 'google',
//   password: 'your-secret-bell-password-that-is-at-least-32-characters-long',
//   isSecure: false, // False untuk pengembangan, pastikan menjadi true di production
//   clientId: 'YOUR_GOOGLE_CLIENT_ID',
//   clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
//   location: server.info.uri,
//   providerParams: {
//     access_type: 'offline', // Ini memungkinkan untuk mendapatkan refresh token
//   },
//   scope: ['profile', 'email'],
//   forceHttps: true // Pakai true untuk produksi
// });
