const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_not_admin');

const modelFindUserGlobal = async (email) => {
  const query = {
    "from_google.email": email,
  };

  try {
    const findUserGlobal = await collection.findOne(query);
    return findUserGlobal;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

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
        user: findUser,
      };
    }

    const result = await collection.insertOne(fieldInformationUser);
    const findAfterInsert = await collection.findOne({ "from_google.email": newUser.parseDataRaw.email });
    return {
      status: 'success',
      message: 'data tidak ada',
      register: true,
      user: findAfterInsert,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const modelUpdateUserInfoLogin = async (email, createTokenAccess) => {
  const query = {
    "from_google.email": email,
  };

  try {
    const checkingEmailStatus = await collection.findOne(query);
    if (!checkingEmailStatus.account_active) {
      return {
        status: 'fail',
        message: 'Account belom aktif',
        account: false,
      };
    }
    const dataUpdate = {
      $set: {
        isLogin: true,
        timeLogin: new Date().toISOString(),
        tokenWeb: createTokenAccess,
      },
    };
    const updateUserLogin = await collection.updateOne(query, dataUpdate);
    const findUser = await collection.findOne(query);
    return findUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const modelActivatedAccount = async (userInformation) => {
  const query = {
    "from_google.email": userInformation.email,
  };

  try {
    const findUser = await collection.findOne(query);
    if (findUser.code_actived !== userInformation.code) {
      return {
        status: 'fail',
        message: 'Kode aktifasi tidak cocok!',
      };
    }

    const updatingValidCode = await collection.updateOne(query, {
      $set: {
        account_active: true,
      },
    });
    return {
      status: 'success',
      message: 'Account berhasil di aktifkan!',
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  modelFindUserGlobal,
  modelSaveUserInformation,
  modelUpdateUserInfoLogin,
  modelActivatedAccount,
};
