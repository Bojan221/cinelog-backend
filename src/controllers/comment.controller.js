const db = require("../config/db");

const mapComment = (row) => ({
  id: row.id,
  user_id: row.user_id,
  content: row.content,
  tmdb_id: row.tmdb_id,
  media_type: row.media_type,
  created_at: row.created_at,
  user: {
    firstName: row.first_name,
    lastName: row.last_name,
    avatar: row.avatar,
    username: row.username,
  },
});

const getMediaComments = async (req, res) => {
  try {
    const mediaId = req.params.id;
    const mediaType = req.query.mediaType;

    const [rows] = await db.query(
      `SELECT c.id, c.user_id, c.content, c.tmdb_id, c.media_type, c.created_at,
              u.first_name, u.last_name, u.avatar, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.tmdb_id = ? AND c.media_type = ?
       ORDER BY c.created_at DESC`,
      [mediaId, mediaType],
    );

    const comments = rows.map(mapComment);

    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { content, mediaId, mediaType } = req.body;
    const userId = req.user.id;

    const [result] = await db.query(
      "INSERT INTO comments (user_id, content, tmdb_id, media_type) VALUES (?, ?, ?, ?)",
      [userId, content, mediaId, mediaType],
    );

    const [rows] = await db.query(
      `SELECT c.id, c.user_id, c.content, c.tmdb_id, c.media_type, c.created_at,
              u.first_name, u.last_name, u.avatar, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [result.insertId],
    );

    res.status(201).json({ comment: mapComment(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMediaComments, addComment };
