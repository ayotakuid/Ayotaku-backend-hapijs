const createAvatarDefault = async (username) => {
  const { createAvatar } = await import('@dicebear/core');
  const { adventurer } = await import('@dicebear/collection');

  const responseCreate = createAvatar(adventurer, {
    seed: username,
    radius: 50,
    size: 80,
    backgroundColor: ['ffdfbf', 'c0aede'],
    earringsProbability: 50,
    eyebrows: ['variant02', 'variant03', 'variant06', 'variant10', 'variant11', 'variant15'],
    featuresProbability: 0,
    glassesProbability: 50,
    hairProbability: 100,
  });

  const returnSvg = responseCreate.toString();
  return returnSvg;
};

module.exports = {
  createAvatarDefault,
};
