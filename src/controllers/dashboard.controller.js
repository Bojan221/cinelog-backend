const db = require("../config/db");
const { TmdbService } = require("../services/tmdb.service");

const getRecentWatchedTv = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      "SELECT u.season_number, u.episode_number, u.watched_at, u.poster AS episode_poster, m.* FROM user_episodes AS u LEFT JOIN media AS m ON u.media_id = m.id WHERE u.user_id = ? ORDER BY u.watched_at DESC LIMIT 20",
      [userId],
    );
    res.status(200).json({ episodes: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const topMedia = async (req, res) => {
  try {
    const topRatedData = await TmdbService.getTopRated();
    const upcomingData = await TmdbService.getUpcoming();
    const trendingData = await TmdbService.getTrending();
    res.status(200).json([
      { name: "Top Rated", data: topRatedData.results },
      { name: "Upcoming", data: upcomingData.results },
      { name: "Trending", data: trendingData.results },
    ]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRecentWatchedTv, topMedia };
