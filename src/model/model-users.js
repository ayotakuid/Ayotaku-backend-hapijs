const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_users');

const handlerSaveUsers = async (newUser, tokenAyotaku) => {
  const fieldCollection = {
    uuid: nanoid(16),
    id_mal: newUser?.id_mal,
    name_mal: newUser?.name_mal,
    img_profile: newUser?.img_profile,
    username: null,
    password: null,
    isLogin: false,
    timeLogin: null,
    role: newUser?.role,
    token: tokenAyotaku,
    token_mal: newUser.token_mal,
    created_at: new Date().toISOString(),
  };

  try {
    const result = await collection.insertOne(fieldCollection);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

const handlerUpdateLoginUsers = async (dataUser, tokenAyotaku) => {
  try {
    const query = {
      name_mal: dataUser.name_mal,
    };

    const dataUpdate = {
      $set: {
        timeLogin: new Date().toISOString(),
        isLogin: true,
        token: tokenAyotaku,
        token_mal: dataUser.token_mal,
      },
    };
    const updateUsersLogin = collection.updateOne(query, dataUpdate);
    return updateUsersLogin;
  } catch (err) {
    console.error(err);
  }
};

const handlerUpdateSignOutUsers = async (dataUser, refreshToken) => {
  try {
    const query = {
      name_mal: dataUser.name_mal,
    };

    const dataUpdate = {
      $set: {
        isLogin: false,
        token: refreshToken,
      },
    };
    const updateUserSignOut = collection.updateOne(query, dataUpdate);
    return updateUserSignOut;
  } catch (err) {
    console.error(err);
  }
};

const handlerUserByNameMAL = async (nameMAL) => {
  try {
    const user = await collection.findOne({
      name_mal: nameMAL,
    });
    return user;
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = {
  handlerSaveUsers,
  handlerUserByNameMAL,
  handlerUpdateLoginUsers,
  handlerUpdateSignOutUsers,
};
