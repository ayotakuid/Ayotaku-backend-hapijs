const createSlugEpisode = (episode) => {
  const changeEpisode = episode.replace(/ /g, "-").toLowerCase();
  return `${changeEpisode}-${new Date().getTime()}`;
};

module.exports = {
  createSlugEpisode,
};
