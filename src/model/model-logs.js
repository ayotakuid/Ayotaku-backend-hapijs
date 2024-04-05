const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_logs');

const typeTextLogs = (type) => {
  if (type === 'signup') {
    return 'Seseorang telah membuat akun';
  }
};

const handlerSaveLogsUser = async (data, typeLogs) => {
  const type = typeTextLogs(typeLogs);
  const fieldCollection = {
    uuid: nanoid(16),
    id_user: data?.uuid,
    text: type,
    type: typeLogs,
    date: new Date().toISOString(),
  };

  try {
    const result = await collection.insertOne(fieldCollection);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerSaveLogsUser,
};
