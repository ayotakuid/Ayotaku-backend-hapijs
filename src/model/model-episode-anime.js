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

const modelShowEpisode = async () => {
  try {
    const pipeLine = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'ayotaku_users',
          localField: 'id_admin',
          foreignField: 'id_mal',
          as: 'admin',
        },
      },
      {
        $lookup: {
          from: 'ayotaku_animes',
          localField: 'id_anime',
          foreignField: 'uuid',
          as: 'anime',
        },
      },
      {
        $unwind: '$admin',
      },
      {
        $unwind: '$anime',
      },
      {
        $addFields: {
          whois: {
            id_admin: '$admin.id_mal',
            username_mal: '$admin.name_mal',
          },
        },
      },
      {
        $addFields: {
          animes: {
            id_anime: '$anime.uuid',
            judul_anime: '$anime.data.nama_anime.romanji',
          },
        },
      },
      {
        $unset: 'admin',
      },
      {
        $unset: 'anime',
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const getAllEpisode = await collection.aggregate(pipeLine).toArray();
    return getAllEpisode;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const modelSoftDeleteEpisode = async (episodeUuid) => {
  try {
    const query = {
      uuid: episodeUuid,
    };

    const dataUpdate = {
      $set: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    };

    const pipeLineAggregate = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'ayotaku_users',
          localField: 'id_admin',
          foreignField: 'id_mal',
          as: 'admin',
        },
      },
      {
        $lookup: {
          from: 'ayotaku_animes',
          localField: 'id_anime',
          foreignField: 'uuid',
          as: 'anime',
        },
      },
      {
        $unwind: '$admin',
      },
      {
        $unwind: '$anime',
      },
      {
        $addFields: {
          whois: {
            id_admin: '$admin.id_mal',
            username_mal: '$admin.name_mal',
          },
        },
      },
      {
        $addFields: {
          animes: {
            id_anime: '$anime.uuid',
            judul_anime: '$anime.data.nama_anime.romanji',
          },
        },
      },
      {
        $unset: 'admin',
      },
      {
        $unset: 'anime',
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const softDeleteEpisode = await collection.updateOne(query, dataUpdate);
    const returnData = await collection.aggregate(pipeLineAggregate).toArray();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const modelShowEpisodeDelete = async () => {
  try {
    const pipeLine = [
      {
        $match: {
          isDeleted: true,
        },
      },
      {
        $lookup: {
          from: 'ayotaku_users',
          localField: 'id_admin',
          foreignField: 'id_mal',
          as: 'admin',
        },
      },
      {
        $lookup: {
          from: 'ayotaku_animes',
          localField: 'id_anime',
          foreignField: 'uuid',
          as: 'anime',
        },
      },
      {
        $unwind: '$admin',
      },
      {
        $unwind: '$anime',
      },
      {
        $addFields: {
          whois: {
            id_admin: '$admin.id_mal',
            username_mal: '$admin.name_mal',
          },
        },
      },
      {
        $addFields: {
          animes: {
            id_anime: '$anime.uuid',
            judul_anime: '$anime.data.nama_anime.romanji',
          },
        },
      },
      {
        $unset: 'admin',
      },
      {
        $unset: 'anime',
      },
      {
        $sort: {
          deletedAt: -1,
        },
      },
    ];

    const showEpisodeDelete = await collection.aggregate(pipeLine).toArray();
    return showEpisodeDelete;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  modelSaveEpisode,
  modelShowEpisode,
  modelSoftDeleteEpisode,
  modelShowEpisodeDelete,
};
