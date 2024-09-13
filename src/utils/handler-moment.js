const moment = require('moment');
const { nanoid } = require('nanoid');
const { modelFindTicketResetPassword } = require('../ayotaku-model-users/ayotaku-model-password');

const createTicketCodeReset = (userId) => {
  const code = nanoid(64);
  const exp = moment().add(2, 'minutes');

  return { userId, code, exp };
};

const validateCode = async (userId, ticketCode) => {
  try {
    const findTicket = await modelFindTicketResetPassword(userId, ticketCode);

    if (!findTicket.ticket) {
      return {
        validate: false,
        message: 'Ticket tidak ditemukan!',
      };
    }

    if (findTicket?.data.userId !== userId && findTicket?.data.code === ticketCode) {
      return {
        validate: false,
        message: 'Ticket/User tidak cocok!',
      };
    }

    const isExpired = moment().isAfter(findTicket?.data.exp);
    if (isExpired) {
      return {
        validate: false,
        message: 'Kode Reset Expired!',
      };
    }

    return {
      validate: true,
      message: 'Code still valid',
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  createTicketCodeReset,
  validateCode,
};
