const validateInputDisplayUsername = (text) => {
  const regex = /^[a-zA-Z0-9 _-]+$/;
  return regex.test(text);
};

module.exports = {
  validateInputDisplayUsername,
};
