const db = require("../config/db");

const getPublicLists = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT  
                l.*,
                COUNT(li.id) AS item_count,
                u.first_name,
                u.last_name,
                u.avatar,
                u.username,
                u.email
            FROM lists AS l
            LEFT JOIN list_items AS li  
                ON l.id = li.list_id
            LEFT JOIN users AS u  
                ON l.user_id = u.id
            WHERE l.is_public = 1
            GROUP BY l.id, u.id
        `);

    const formattedList = rows.map((list) => ({
      id: list.id,
      user_id: list.user_id,
      name: list.name,
      media_type: list.media_type,
      is_default: list.is_default,
      is_public: list.is_public,
      created_at: list.created_at,
      item_count: list.item_count,
      user: {
        firstName: list.first_name,
        lastName: list.last_name,
        avatar: list.avatar,
        username: list.username,
        email: list.email,
      },
    }));

    res.status(200).json({ lists: formattedList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getListById = async (req, res) => {
  try {
    const { id } = req.params;

    const [lists] = await db.query(
      `
            SELECT
                l.*,
                COUNT(li.id) AS item_count,
                u.first_name,
                u.last_name,
                u.avatar,
                u.username,
                u.email
            FROM lists AS l
            LEFT JOIN list_items AS li
                ON l.id = li.list_id
            LEFT JOIN users AS u
                ON l.user_id = u.id
            WHERE l.id = ?
            GROUP BY l.id, u.id
        `,
      [id],
    );

    if (lists.length === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    const list = lists[0];

    const [items] = await db.query(
      `SELECT m.tmdbId, m.title, m.overview, m.poster, m.releaseDate, m.vote, m.runtime, m.type, li.added_at
       FROM list_items li
       JOIN media m ON m.id = li.media_id
       WHERE li.list_id = ?
       ORDER BY li.added_at DESC`,
      [id],
    );

    const formattedList = {
      id: list.id,
      user_id: list.user_id,
      name: list.name,
      media_type: list.media_type,
      is_default: list.is_default,
      is_public: list.is_public,
      created_at: list.created_at,
      item_count: list.item_count,
      user: {
        firstName: list.first_name,
        lastName: list.last_name,
        avatar: list.avatar,
        username: list.username,
        email: list.email,
      },
      list_items: items,
    };

    res.status(200).json({ list: formattedList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPublicLists, getListById };
