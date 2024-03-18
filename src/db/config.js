const { MongoClient } = require('mongodb');
const { MONGODB_URI, DB_NAME } = require('../utils/secret.json');

const client = new MongoClient(MONGODB_URI);

const connect = async () => {
  try {
    await client.connect();
    console.log(`Berhasil terhubung ke Datasbase ${DB_NAME}`);
  } catch (err) {
    console.error(`Ada kesalahan saat terhubung: ${err}`);
  }
};

module.exports = {
  connect,
  client,
  DB_NAME,
};
