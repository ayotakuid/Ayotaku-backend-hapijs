const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collectionRecommend = db.collection('ayotaku_recommend');

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

module.exports = {
  handlerModelUserlAggregateRecommend,
};
