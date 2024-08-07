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
    isLogin: true,
    timeLogin: new Date().toISOString(),
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

    const checkingIsLogin = await collection.findOne(query);

    if (checkingIsLogin.role === 'user') {
      const dataUpdate = {
        $set: {
          timeLogin: new Date().toISOString(),
          isLogin: false,
          token: tokenAyotaku,
          token_mal: dataUser.token_mal,
        },
      };
      await collection.updateOne(query, dataUpdate);
      const resultFindLogin = await collection.findOne(query);
      return resultFindLogin;
    }

    const dataUpdate = {
      $set: {
        timeLogin: new Date().toISOString(),
        isLogin: true,
        token: tokenAyotaku,
        token_mal: dataUser.token_mal,
      },
    };
    await collection.updateOne(query, dataUpdate);
    const resultFindLogin = await collection.findOne(query);
    return resultFindLogin;
  } catch (err) {
    console.error(err);
  }
};

const handlerUpdateSignOutUsers = async (dataUser, refreshToken) => {
  try {
    const query = {
      name_mal: dataUser?.name_mal,
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

const handlerGetAllUser = async () => {
  try {
    const user = collection.find().toArray();
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerGetOnlineUser = async () => {
  try {
    const user = collection.find({
      isLogin: true,
    }).toArray();
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerShowUsers = async () => {
  try {
    const getAllUsers = await collection.find().sort({ created_at: -1 }).toArray();
    return getAllUsers;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerEditRoleUsers = async (nameMAL, dataRole) => {
  try {
    const query = {
      name_mal: nameMAL,
    };

    const dataUpdate = {
      $set: {
        role: dataRole,
      },
    };

    const updateRole = await collection.updateOne(query, dataUpdate);
    const returnData = await collection.findOne(query);
    return returnData;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handlerSaveUsers,
  handlerUserByNameMAL,
  handlerUpdateLoginUsers,
  handlerUpdateSignOutUsers,
  handlerGetAllUser,
  handlerGetOnlineUser,
  handlerShowUsers,
  handlerEditRoleUsers,
};
