const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_not_admin');

const modelSaveUserInformation = async (newUser, tokenCreatedWeb, tokenCreatedMob) => {
  const fieldInformationUser = {
    uuid: nanoid(16),
    from_google: {
      id_google: newUser.parseDataRaw.sub,
      nama_google: newUser.parseDataRaw.name,
      email: newUser.parseDataRaw.email,
      picture: newUser.parseDataRaw.picture,
      email_verified: newUser.parseDataRaw.email_verified,
    },
    via_register: newUser.via_register,
    account_active: false,
    code_actived: newUser.code_actived,
    username: newUser.username,
    displayUsername: newUser.displayUsername,
    password: newUser.password,
    isLogin: false,
    timeLogin: null,
    tokenWeb: tokenCreatedWeb,
    tokenMob: tokenCreatedMob,
    created_at: new Date().toISOString(),
  };

  try {
    const findUser = await collection.findOne({ "from_google.email": newUser.parseDataRaw.email });

    if (findUser) {
      return {
        status: 'success',
        message: 'data sudah ada',
        register: false,
      };
    }

    const result = await collection.insertOne(fieldInformationUser);
    return {
      status: 'success',
      message: 'data tidak ada',
      register: true,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  modelSaveUserInformation,
};
