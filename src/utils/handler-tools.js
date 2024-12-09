const validateInputDisplayUsername = (text) => {
  const regex = /^[a-zA-Z0-9 _-]+$/;
  return regex.test(text);
};

const previousSeason = (currentSeason) => {
  switch (currentSeason) {
    case 'winter':
      return 'fall';
    case 'spring':
      return 'winter';
    case 'summer':
      return 'spring';
    case 'fall':
      return 'summer';
    default:
      return null;
  }
};

const currentSeason = (month) => {
  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'fall'; // Default untuk Oktober-Desember
};

module.exports = {
  validateInputDisplayUsername,
  previousSeason,
  currentSeason,
};
