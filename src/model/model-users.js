const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const handlerSaveUsers = async (newUser, tokenAyotaku) => {
  const db = client.db(DB_NAME);
  const collection = db.collection('ayotaku_users');
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

module.exports = {
  handlerSaveUsers,
};
