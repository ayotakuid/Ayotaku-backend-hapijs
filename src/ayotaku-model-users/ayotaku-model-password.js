const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_reset_logs');

const modelSaveResetPassword = async (fieldInformationReset) => {
  try {
    const result = await collection.insertOne(fieldInformationReset);
    const findAfterInsert = await collection.findOne({ uuid: fieldInformationReset.uuid });

    return {
      status: 'success',
      message: 'Link sudah dibuat',
      data: findAfterInsert,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const modelFindTicketResetPassword = async (ticketCode) => {
  const query = {
    code: ticketCode,
  };

  try {
    const findTicket = await collection.findOne(query);
    if (findTicket.length === 0) {
      return {
        ticket: false,
      };
    }

    return {
      ticket: true,
      data: findTicket,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  modelSaveResetPassword,
  modelFindTicketResetPassword,
};
