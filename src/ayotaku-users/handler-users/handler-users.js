const { createTokenUsers } = require("../../utils/handler-token");

const handlerGoogleLoginUsers = async (request, h) => {
  const { profile } = request.auth.credentials;

  try {
    const dataToken = JSON.stringify(profile.raw);
    return h.redirect(`/user/api/google/callback?raw=${dataToken}&type=web`);
  } catch (err) {
    console.error('Terjadi error saat login google: ', err);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan, Coba lagi.',
    }).code(500);
  }
};

const handlerCallbackAfterLoginGoogle = async (request, h) => {
  const rawParam = request.query.raw;
  const paramType = request.query.type;

  if (!rawParam || !paramType) {
    return h.response({
      status: 'error',
      message: 'params ada yang kurang!',
    }).code(400);
  }

  try {
    const parseDataRaw = JSON.parse(rawParam);

    if (!parseDataRaw) {
      return h.response({
        status: 'error',
        message: 'data untuk token tidak ada.',
      }).code(400);
    }

    if (!parseDataRaw.sub
        || !parseDataRaw.name
        || !parseDataRaw.given_name
        || !parseDataRaw.family_name
        || !parseDataRaw.picture
        || !parseDataRaw.email
        || !parseDataRaw.email_verified) {
      return h.response({
        status: 'error',
        message: 'ada data yang kurang.',
      }).code(400);
    }

    if (!paramType || paramType !== 'web') {
      return h.response({
        status: 'error',
        message: 'type salah',
      }).code(400);
    }

    const createTokenAccess = createTokenUsers(parseDataRaw);
    return h.response({
      status: 'success',
      message: 'Berhasil login!',
      _token: createTokenAccess,
    }).code(200);
  } catch (err) {
    console.error('Ada error saat callback setelah google: ', err);
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat callback.',
    }).code(500);
  }
};

module.exports = {
  handlerGoogleLoginUsers,
  handlerCallbackAfterLoginGoogle,
};
