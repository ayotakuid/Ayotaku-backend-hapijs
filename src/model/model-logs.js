const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_logs');

const typeTextLogs = (type, data) => {
  if (type === 'signup') {
    return 'Seseorang telah membuat akun';
  }

  if (type === 'signin-admin') {
    return `${data?.name_mal}. Role admin telah signin!`;
  }

  if (type === 'signout-admin') {
    return `${data?.name_mal}. Role admin telah signout!`;
  }
};

const fieldCollection = (data, typeLogs) => {
  const textType = typeTextLogs(typeLogs, data);
  if (typeLogs === 'signup') {
    return {
      uuid: nanoid(16),
      user: data,
      text: textType,
      type: typeLogs,
      date: new Date().toISOString(),
    };
  }

  return {
    uuid: nanoid(16),
    user: data?.uuid,
    text: textType,
    type: typeLogs,
    date: new Date().toISOString(),
  };
};

const handlerSaveLogsUser = async (data, typeLogs) => {
  try {
    const result = await collection.insertOne(fieldCollection(data, typeLogs));
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerSaveLogsUser,
};
