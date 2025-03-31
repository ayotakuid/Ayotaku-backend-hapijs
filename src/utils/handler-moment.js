const moment = require('moment');
const { nanoid } = require('nanoid');
const { modelFindTicketResetPassword } = require('../ayotaku-model-users/ayotaku-model-password');
const { URI_GOOGLE_VALIDATE_CAPTCHA, RECAPTCHA_SECRET_KEY } = require('./secret.json');

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

const verifyCodeCaptcha = async (captchaValue) => {
  try {
    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };
    const responseFetchingVerif = await fetch(`${URI_GOOGLE_VALIDATE_CAPTCHA}?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`, requestOptions);
    const returnData = await responseFetchingVerif.json();

    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const formatDateForSuggested = async () => {
  const now = new Date();
  // Tambah 1 hari
  now.setUTCDate(now.getUTCDate() + 1);

  // Atur waktu ke 00:00 UTC
  now.setUTCHours(0, 0, 0, 0);

  // INI SUDAH JAM 7 PAGI DI INDONESIA
  return new Date(now.getTime());
};

const checkingDateSuggested = async (date) => {
  const dateChecking = new Date(); // Tanggal saat ini
  const differenceInMs = date - dateChecking; // Selisih dalam ms
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24); // Konversi ke hari
  const differenceInSeconds = Math.floor(differenceInMs / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const remainingMinutes = differenceInMinutes % 60;
  const remainingSeconds = differenceInSeconds % 60;

  console.log(`Selisih waktu: ${differenceInHours} jam, ${remainingMinutes} menit, ${remainingSeconds} detik`);

  return { status: differenceInDays >= 1 };
};

module.exports = {
  createTicketCodeReset,
  validateCode,
  verifyCodeCaptcha,
  checkingDateSuggested,
  formatDateForSuggested,
};
