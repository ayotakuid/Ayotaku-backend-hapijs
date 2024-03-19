const { client, DB_NAME } = require('../db/config');

const handlerSaveUsers = async (newUser) => {
  const db = client.db(DB_NAME);
  const collection = db.collection('ayotaku_users');

  try {
    const result = await collection.insertOne(newUser);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handlerSaveUsers,
};
