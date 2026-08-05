const db = require("../config/db");

const MEDIA_TYPES = ["movie", "tv"];

const isValidVote = (v) => Number.isFinite(v) && v >= 0.5 && v <= 5;

const addVote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mediaId, mediaType } = req.body;
    const vote = Number(req.body.vote);

    if (!mediaId || !MEDIA_TYPES.includes(mediaType) || !isValidVote(vote)) {
      return res.status(400).json({ message: "Invalid vote data" });
    }

    try {
      await db.query(
        "INSERT INTO votes (user_id, vote, tmdb_id, media_type) VALUES (?, ?, ?, ?)",
        [userId, vote, mediaId, mediaType],
      );
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "You already rated this. Use update instead." });
      }
      throw err;
    }

    return res.status(201).json({ vote });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateVote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mediaId, mediaType } = req.body;
    const vote = Number(req.body.vote);

    if (!mediaId || !MEDIA_TYPES.includes(mediaType) || !isValidVote(vote)) {
      return res.status(400).json({ message: "Invalid vote data" });
    }

    const [existing] = await db.query(
      "SELECT id FROM votes WHERE user_id = ? AND tmdb_id = ? AND media_type = ?",
      [userId, mediaId, mediaType],
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "No rating to update" });
    }

    await db.query(
      "UPDATE votes SET vote = ? WHERE user_id = ? AND tmdb_id = ? AND media_type = ?",
      [vote, userId, mediaId, mediaType],
    );

    return res.status(200).json({ vote });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addVote, updateVote };
