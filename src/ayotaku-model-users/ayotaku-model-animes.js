const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collectionRecommend = db.collection('ayotaku_recommend');
const collectionAnimes = db.collection('ayotaku_animes');

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
    // const parseYear = parseInt(filterYear, 10);
    const pipeLineAggregate = [
      {
        $match: {
          "data.season.season": { $in: filterSeason.map((season) => season.toLowerCase()) },
          "data.season.year": { $in: filterYear.map((year) => year) },
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
                createdAt: -1,
              },
            },
            {
              $limit: 5,
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
          "detail_eps.created_at": -1,
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

module.exports = {
  handlerModelUserlAggregateRecommend,
  handlerModelLastUpdate,
};
