const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_animes');
const collectionRecommend = db.collection('ayotaku_recommend');

const createSlugAnime = (title) => {
  const changeTitle = title.replace(/ /g, "-").toLowerCase();
  const removeSpecial = changeTitle.replace(/[^\w\s.\-]/g, "");
  return `${removeSpecial}-${new Date().getTime()}`;
};

const handlerSaveAnime = async (data, admin) => {
  const created = new Date().toISOString();

  try {
    const result = await collection.insertOne({
      uuid: nanoid(16),
      id_admin: admin,
      slug: createSlugAnime(data.nama_anime.romanji),
      data,
      created_at: created,
      updated_at: created,
      isDeleted: false,
      deleted_at: null,
    });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerCheckingAnime = async (id) => {
  try {
    const searchingAnime = await collection.find({
      "data.id_anime": id,
    }).toArray();
    return searchingAnime;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelShowAnime = async () => {
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
        $unwind: '$admin',
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
        $unset: 'admin',
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ];

    const getAllAnime = await collection.aggregate(pipeLine).toArray();
    return getAllAnime;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelSoftDelete = async (animeUuid) => {
  try {
    const query = {
      uuid: animeUuid,
    };

    const dataUpdate = {
      $set: {
        isDeleted: true,
        deleted_at: new Date().toISOString(),
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
        $unwind: '$admin',
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
        $unset: 'admin',
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ];

    const softDeleteAnime = await collection.updateOne(query, dataUpdate);
    const returnData = await collection.aggregate(pipeLineAggregate).toArray();
    return returnData;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const handlerModelShowAnimeDelete = async () => {
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
        $unwind: '$admin',
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
        $unset: 'admin',
      },
      {
        $sort: {
          deleted_at: -1,
        },
      },
    ];

    const showAnimeDelete = await collection.aggregate(pipeLine).toArray();
    return showAnimeDelete;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelRecoveryAnime = async (animeUuid) => {
  try {
    const query = {
      uuid: animeUuid,
    };

    const dataUpdate = {
      $set: {
        isDeleted: false,
        deleted_at: null,
      },
    };

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
        $unwind: '$admin',
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
        $unset: 'admim',
      },
      {
        $sort: {
          deleted_at: -1,
        },
      },
    ];

    const recoveryAnime = await collection.updateOne(query, dataUpdate);
    const returnData = await collection.aggregate(pipeLine).toArray();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelSyncAnime = async (animeUuid, dataUpdated) => {
  try {
    const query = {
      uuid: animeUuid,
    };

    const dataUpdate = {
      $set: {
        'data.start_date': dataUpdated?.start_date,
        'data.end_date': dataUpdated?.end_date,
        'data.rating': dataUpdated?.rating,
        'data.status': dataUpdated?.status,
      },
    };

    const pipeLineSync = [
      {
        $match: {
          uuid: animeUuid,
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
        $unwind: '$admin',
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
        $unset: 'admin',
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ];

    const updateData = await collection.updateOne(query, dataUpdate);
    const returnData = await collection.aggregate(pipeLineSync).toArray();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelManualEditAnime = async (animeUuid, dataUpdated) => {
  try {
    const query = {
      uuid: animeUuid,
    };

    const dataUpdate = {
      $set: {
        'data.foto_anime': dataUpdated?.image,
        'data.video': dataUpdated?.video,
      },
    };

    const pipeLineSync = [
      {
        $match: {
          uuid: animeUuid,
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
        $unwind: '$admin',
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
        $unset: 'admin',
      },
      {
        $sort: {
          deleted_at: -1,
        },
      },
    ];

    const updateData = await collection.updateOne(query, dataUpdate);
    const returnData = await collection.aggregate(pipeLineSync).toArray();
    return returnData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelGetAllAnime = async () => {
  try {
    const getlAllAnime = await collection.find().toArray();
    return getlAllAnime;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelSearchAnime = async (searchAnime) => {
  try {
    const queryAnime = {
      $or: [
        {
          'data.nama_anime.eng': {
            $regex: searchAnime,
            $options: 'i',
          },
        },
        {
          'data.nama_anime.romanji': {
            $regex: searchAnime,
            $options: 'i',
          },
        },
      ],
    };
    const getAllAnime = await collection.find(queryAnime).toArray();
    return getAllAnime;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelCheckingRecommend = async (idAnime) => {
  try {
    const query = {
      id_anime_db: idAnime,
    };

    const searchRecommend = await collectionRecommend.findOne(query);
    return searchRecommend;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelSaveRecommend = async (data) => {
  const created = new Date().toISOString();

  try {
    const result = await collectionRecommend.insertOne({
      uuid: nanoid(16),
      id_anime_db: data?.id_anime,
      slug_anime: data?.slug_anime,
      default_img: data?.default_img,
      edit_img: (data?.edit_img) ? data?.edit_img : null,
      created_at: created,
    });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerGetAllRecommend = async () => {
  try {
    const getAllRecommend = await collectionRecommend.find().toArray();
    return getAllRecommend;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerSaveAnime,
  handlerCheckingAnime,
  handlerModelShowAnime,
  handlerModelSoftDelete,
  handlerModelShowAnimeDelete,
  handlerModelRecoveryAnime,
  handlerModelSyncAnime,
  handlerModelManualEditAnime,
  handlerModelGetAllAnime,
  handlerModelSearchAnime,
  handlerModelCheckingRecommend,
  handlerModelSaveRecommend,
  handlerGetAllRecommend,
};
