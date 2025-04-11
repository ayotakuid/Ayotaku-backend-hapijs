const { client, DB_NAME } = require('../db/config');
const { formatDateForSuggested } = require("../utils/handler-moment");

const db = client.db(DB_NAME);
const collectionRecommend = db.collection('ayotaku_recommend');
const collectionAnimes = db.collection('ayotaku_animes');
const collectionSuggest = db.collection('ayotaku_suggested');

const handlerModelUserlAggregateRecommend = async () => {
  try {
    const pipeLineAggregate = [
      {
        $lookup: {
          from: 'ayotaku_animes',
          localField: 'id_anime_db',
          foreignField: 'uuid',
          as: 'recommend',
        },
      },
      {
        $unwind: '$recommend',
      },
      {
        $addFields: {
          detail: {
            nama_anime: '$recommend.data.nama_anime',
            media_type: '$recommend.data.media_type',
            status: '$recommend.data.status',
            season: '$recommend.data.season',
            rating: '$recommend.data.rating',
          },
        },
      },
      {
        $unset: ['recommend', '_id', 'uuid', 'id_anime_db'],
      },
      {
        $sort: {
          created_at: -1,
        },
      },
    ];

    const responseAggregate = await collectionRecommend.aggregate(pipeLineAggregate).toArray();
    return responseAggregate;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelLastUpdate = async (filterYear, filterSeason) => {
  try {
    const pipeLineAggregate = [
      {
        $match: {
          "data.season.season": { $in: filterSeason.map((season) => season.toLowerCase()) },
          "data.season.year": { $in: filterYear.map((year) => year) },
        },
      },
      {
        $sort: {
          created_at: -1, // INI UNTUK MENGURUTKAN COLLECTION ANIME NYA
        },
      },
      {
        $lookup: {
          from: 'ayotaku_episode',
          localField: 'uuid',
          foreignField: 'id_anime',
          as: 'episodes',
          pipeline: [
            {
              $sort: {
                createdAt: -1, // DAN YANG INI UNTUK EPISODENYA
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0, // Hapus `_id` bawaan MongoDB
          id: '$uuid', // ID anime
          nama_anime: '$data.nama_anime',
          foto_anime: '$data.foto_anime',
          slug_anime: '$slug',
          rating: '$data.rating',
          season: '$data.season',
          media_type: '$data.media_type',
          status: '$data.status',
          detail_eps: {
            $map: {
              input: '$episodes', // Array episodes sudah terurut
              as: 'ep',
              in: {
                id: '$$ep.uuid',
                slug_eps: '$$ep.slug_eps',
                episode: '$$ep.episode',
                link_stream: '$$ep.link_stream',
                link_download: '$$ep.link_download',
                created_at: '$$ep.createdAt',
              },
            },
          },
        },
      },
      {
        $sort: {
          "detail_eps.created_at": -1, // DAN INI SORT FINAL KHUSUS EPISODENYA
        },
      },
    ];

    const responseAggregate = await collectionAnimes.aggregate(pipeLineAggregate).toArray();
    return responseAggregate;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelSuggestedInsert = async () => {
  try {
    const randomSuggested = await collectionAnimes.aggregate([
      { $sample: { size: 12 } }, { $project: { _id: 0 } }, { $sort: { created_at: -1 } },
    ]).toArray();

    const bulkInsertData = await Promise.all(randomSuggested.map(async (item) => ({
      refreshDate: (await formatDateForSuggested()).toISOString(),
      dataNimes: {
        id_anime: item.uuid,
        slug: item.slug,
      },
    })));

    await collectionSuggest.deleteMany();
    await collectionSuggest.insertMany(bulkInsertData);
    return { status: "success", message: "Data inserted successfully" };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelSuggestedGet = async () => {
  try {
    const pipeLineAggregate = [
      {
        $lookup: {
          from: 'ayotaku_animes',
          localField: 'dataNimes.id_anime',
          foreignField: 'uuid',
          as: 'suggested',
        },
      },
      {
        $unwind: '$suggested',
      },
      {
        $addFields: {
          detail: {
            nama_anime: '$suggested.data.nama_anime',
            media_type: '$suggested.data.media_type',
            status: '$suggested.data.status',
            season: '$suggested.data.season',
            rating: '$suggested.data.rating',
          },
        },
      },
      {
        $unset: ['_id', 'dataNimes', 'id_admin'],
      },
      {
        $sort: {
          refreshDate: -1,
        },
      },
    ];
    const findAll = await collectionSuggest.aggregate(pipeLineAggregate).toArray();
    return findAll;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const handlerModelAnimePagination = async ({ skip = 0, limit = 18 }) => {
  try {
    const dataPagination = await collectionAnimes.find(
      {},
      { projection: { _id: 0, id_admin: 0 } },
    ).sort({
      "data.nama_anime.romanji": 1,
    }).skip(skip)
      .limit(limit)
      .toArray();

    const totalData = await collectionAnimes.countDocuments();
    const totalPages = Math.ceil(totalData / limit);

    return {
      dataPagination,
      pagination: {
        totalData,
        totalPages,
      },
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  handlerModelUserlAggregateRecommend,
  handlerModelLastUpdate,
  handlerModelSuggestedInsert,
  handlerModelSuggestedGet,
  handlerModelAnimePagination,
};
