const { nanoid } = require('nanoid');
const { client, DB_NAME } = require('../db/config');

const db = client.db(DB_NAME);
const collection = db.collection('ayotaku_animes');

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

const handlerModelShowAnime = async (request, h) => {
  try {
    const pipeLine = [
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

module.exports = {
  handlerSaveAnime,
  handlerCheckingAnime,
  handlerModelShowAnime,
};
