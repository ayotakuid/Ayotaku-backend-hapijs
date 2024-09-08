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
    const findUserViaEmail = await collection.findOne({ "from_google.email": newUser.parseDataRaw.email });
    const findUserViaUsername = await collection.findOne({ username: newUser.username });

    if (findUserViaEmail) {
      return {
        status: 'success',
        message: 'Email already exist!',
        register: false,
        user: findUserViaEmail,
      };
    }

    if (findUserViaUsername?.username === newUser.username
        && findUserViaUsername && findUserViaUsername?.username !== null) {
      return {
        status: 'success',
        message: 'Username already exist!',
        register: false,
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

const modelUpdateUserInfoLogin = async (email, createTokenAccess, type) => {
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

    let dataUpdate;
    if (type === 'mobile') {
      dataUpdate = {
        $set: {
          isLogin: true,
          timeLogin: new Date().toISOString(),
          tokenMob: createTokenAccess,
        },
      };
    } else {
      dataUpdate = {
        $set: {
          isLogin: true,
          timeLogin: new Date().toISOString(),
          tokenWeb: createTokenAccess,
        },
      };
    }

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

const modelFindUserByUsername = async (_username) => {
  const query = {
    username: _username,
  };

  try {
    const checkingEmailStatus = await collection.findOne(query);

    if (!checkingEmailStatus) {
      return {
        status: 'fail',
        message: 'Username tidak ada!',
        account: false,
      };
    }

    if (!checkingEmailStatus.account_active) {
      return {
        status: 'fail',
        message: 'Account belom aktif!',
        account: false,
      };
    }

    return {
      status: 'success',
      message: 'here the account',
      account: true,
      data: checkingEmailStatus,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const findUserForValidateToken = async (userInformation) => {
  try {
    const querUser = {
      "from_google.email": userInformation.email_google,
    };
    const findUser = await collection.findOne(querUser);
    const currentTime = Math.floor(Date.now() / 1000);
    const expiredTokenWeb = userInformation.exp < currentTime;

    if (findUser.from_google.email !== userInformation.email_google) {
      return {
        status: 'fail',
        message: 'Tidak ada Email seperti ini',
        data: false,
      };
    }

    if (!findUser.account_active) {
      return {
        status: 'fail',
        message: 'Account belom aktif!',
        data: false,
      };
    }

    if (userInformation.type === 'mobile') {
      const expiredToken = userInformation.exp < currentTime;

      if (expiredToken) {
        return {
          status: 'fail',
          message: 'Token Expired',
          data: false,
        };
      }
    }

    if (expiredTokenWeb) {
      return {
        status: 'fail',
        message: 'Token Expired',
        data: false,
      };
    }

    return {
      status: 'success',
      message: 'Oke boleh lanjut',
      data: true,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const modelUpdateDisplayUsername = async (_displayUsername, email) => {
  const query = {
    "from_google.email": email,
  };

  try {
    const checkingEmailStatus = await collection.findOne(query);
    if (!checkingEmailStatus.account_active) {
      return {
        status: 'fail',
        message: 'Account belom aktif',
        data: false,
      };
    }

    if (checkingEmailStatus.length === 0) {
      return {
        data: false,
      };
    }

    const dataUpdate = {
      $set: {
        displayUsername: _displayUsername,
      },
    };
    const updateUserInformation = await collection.updateOne(query, dataUpdate);
    return {
      status: 'success',
      message: 'Berhasil diupdate!',
      data: true,
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
  modelFindUserByUsername,
  findUserForValidateToken,
  modelUpdateDisplayUsername,
};
