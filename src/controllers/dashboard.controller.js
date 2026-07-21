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

const getUpNext = async (req, res) => {
  try {
    const userId = req.user.id;

    // All series the user is currently watching.
    const [series] = await db.query(
      `SELECT m.tmdbId, m.title
       FROM list_items li
       JOIN media m ON m.id = li.media_id
       JOIN lists l ON l.id = li.list_id
       WHERE l.user_id = ? AND l.name = ? AND l.media_type = ?
       ORDER BY li.added_at DESC`,
      [userId, "Watching", "tv"],
    );

    const items = await Promise.all(
      series.map(async (row) => {
        const tvshowId = row.tmdbId;

        const [watchedRows] = await db.query(
          `SELECT season_number, episode_number FROM user_episodes
           WHERE user_id = ? AND tvshow_id = ?`,
          [userId, tvshowId],
        );

        const watchedSet = new Set(
          watchedRows.map((r) => `${r.season_number}-${r.episode_number}`),
        );

        const show = await TmdbService.getSingleSerie(tvshowId);

        // Regular seasons only (skip specials / season 0).
        const seasons = (show.seasons || [])
          .filter((s) => s.season_number > 0 && s.episode_count > 0)
          .sort((a, b) => a.season_number - b.season_number);

        const totalEpisodes = seasons.reduce(
          (sum, s) => sum + s.episode_count,
          0,
        );
        const watchedCount = watchedRows.filter(
          (r) => r.season_number > 0,
        ).length;

        // First episode (in order) that hasn't been watched yet.
        let next = null;
        for (const season of seasons) {
          for (let ep = 1; ep <= season.episode_count; ep++) {
            if (!watchedSet.has(`${season.season_number}-${ep}`)) {
              next = { seasonNumber: season.season_number, episodeNumber: ep };
              break;
            }
          }
          if (next) break;
        }

        // Show fully watched -> nothing up next.
        if (!next) return null;

        let details = {};
        try {
          const seasonData = await TmdbService.getSerieSeason(
            tvshowId,
            next.seasonNumber,
          );
          const ep = (seasonData.episodes || []).find(
            (e) => e.episode_number === next.episodeNumber,
          );
          if (ep) {
            details = {
              episodeName: ep.name,
              still: ep.still_path,
              runtime: ep.runtime,
              airDate: ep.air_date,
              vote: ep.vote_average,
            };
          }
        } catch (err) {
          console.error(`Failed to load season for ${tvshowId}:`, err.message);
        }

        return {
          tmdbId: tvshowId,
          serieTitle: show.name || row.title,
          seasonNumber: next.seasonNumber,
          episodeNumber: next.episodeNumber,
          episodeName: details.episodeName ?? null,
          still: details.still ?? null,
          runtime: details.runtime ?? null,
          airDate: details.airDate ?? null,
          vote: details.vote ?? null,
          watchedCount,
          totalEpisodes,
        };
      }),
    );

    const upNext = items.filter(Boolean);

    res.status(200).json({ upNext });
  } catch (err) {
    console.error(err);
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

module.exports = { getRecentWatchedTv, topMedia, getUpNext };
