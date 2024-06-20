const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_episode');
const collectionAnime = db.collection('ayotaku_animes');

const modelSaveEpisode = async (data) => {
  const created = new Date().toISOString();

  try {
    const result = await collection.insertOne({
      uuid: nanoid(16),
      id_anime: data?.id_anime,
      id_admin: data?.id_admin,
      slug_eps: data?.slugEps,
      episode: data?.episode,
      link_stream: data?.link_stream,
      link_download: data?.link_download,
      createdAt: created,
      updateAt: created,
      deletedAt: null,
      isDeleted: false,
    });

    const query = {
      uuid: data?.id_anime,
    };

    const dataUpdate = {
      $set: {
        updated_at: new Date().toISOString(),
      },
    };
    const updateAtAnime = await collectionAnime.updateOne(query, dataUpdate);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  modelSaveEpisode,
};
