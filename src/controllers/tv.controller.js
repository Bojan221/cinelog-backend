const { TmdbService } = require("../services/tmdb.service");
const db = require("../config/db");

const getAllSeries = async (req, res) => {
  try {
    const searchQuery = req.query;
    const data = await TmdbService.getAllSeries(searchQuery);
    const series = data.results.map((serie) => ({
      tmdbId: serie.id,
      title: serie.name,
      overview: serie.overview,
      poster: serie.poster_path,
      releaseDate: serie.first_air_date,
      vote: serie.vote_average,
      backdrop: serie.backdrop_path,
      genres: serie.genre_ids,
    }));
    res
      .status(200)
      .json({ page: data.page, series: series, totalPages: data.total_pages });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const getSerieGenres = async (req, res) => {
  try {
    const genres = await TmdbService.getSerieGenres();
    res.status(200).json({ genres: genres.genres });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSerieById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TmdbService.getSingleSerie(id);

    const serie = {
      tmdbId: data.id,
      title: data.name,
      originalTitle: data.original_name,
      overview: data.overview,
      tagline: data.tagline,
      poster: data.poster_path,
      backdrop: data.backdrop_path,
      firstAirDate: data.first_air_date,
      lastAirDate: data.last_air_date,
      status: data.status,
      type: data.type,
      inProduction: data.in_production,
      episodeRunTime: data.episode_run_time,
      numberOfSeasons: data.number_of_seasons,
      numberOfEpisodes: data.number_of_episodes,
      vote: data.vote_average,
      voteCount: data.vote_count,
      popularity: data.popularity,
      homepage: data.homepage,
      imdbId: data.external_ids?.imdb_id || null,

      genres: data.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),

      creators: data.created_by.map((creator) => ({
        id: creator.id,
        name: creator.name,
        profile: creator.profile_path,
      })),

      networks: data.networks.map((network) => ({
        id: network.id,
        name: network.name,
        logo: network.logo_path,
      })),

      productionCompanies: data.production_companies.map((company) => ({
        id: company.id,
        name: company.name,
        logo: company.logo_path,
      })),

      spokenLanguages: data.spoken_languages.map((language) => ({
        iso: language.iso_639_1,
        name: language.english_name,
      })),

      seasons: data.seasons.map((season) => ({
        id: season.id,
        name: season.name,
        overview: season.overview,
        poster: season.poster_path,
        airDate: season.air_date,
        seasonNumber: season.season_number,
        episodeCount: season.episode_count,
        vote: season.vote_average,
      })),

      lastEpisodeToAir: data.last_episode_to_air
        ? {
            id: data.last_episode_to_air.id,
            name: data.last_episode_to_air.name,
            overview: data.last_episode_to_air.overview,
            still: data.last_episode_to_air.still_path,
            airDate: data.last_episode_to_air.air_date,
            episodeNumber: data.last_episode_to_air.episode_number,
            seasonNumber: data.last_episode_to_air.season_number,
            runtime: data.last_episode_to_air.runtime,
            vote: data.last_episode_to_air.vote_average,
          }
        : null,

      nextEpisodeToAir: data.next_episode_to_air
        ? {
            id: data.next_episode_to_air.id,
            name: data.next_episode_to_air.name,
            overview: data.next_episode_to_air.overview,
            still: data.next_episode_to_air.still_path,
            airDate: data.next_episode_to_air.air_date,
            episodeNumber: data.next_episode_to_air.episode_number,
            seasonNumber: data.next_episode_to_air.season_number,
            runtime: data.next_episode_to_air.runtime,
            vote: data.next_episode_to_air.vote_average,
          }
        : null,

      actors: (data.aggregate_credits?.cast || [])
        .slice(0, 30)
        .map((actor) => ({
          id: actor.id,
          name: actor.name,
          character: actor.roles?.[0]?.character || null,
          episodeCount: actor.total_episode_count,
          profile: actor.profile_path,
        })),

      trailer:
        data.videos?.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer",
        ) || null,

      images: {
        posters: (data.images?.posters || []).map((image) => image.file_path),
        backdrops: (data.images?.backdrops || []).map(
          (image) => image.file_path,
        ),
      },

      similarSeries: (data.similar?.results || []).map((serie) => ({
        tmdbId: serie.id,
        title: serie.name,
        poster: serie.poster_path,
        releaseDate: serie.first_air_date,
        vote: serie.vote_average,
      })),

      recommendedSeries: (data.recommendations?.results || []).map((serie) => ({
        tmdbId: serie.id,
        title: serie.name,
        poster: serie.poster_path,
        releaseDate: serie.first_air_date,
        vote: serie.vote_average,
      })),

      reviews: (data.reviews?.results || []).map((review) => ({
        id: review.id,
        author: review.author,
        rating: review.author_details?.rating,
        avatar: review.author_details?.avatar_path,
        content: review.content,
        createdAt: review.created_at,
      })),

      keywords: (data.keywords?.results || []).map((keyword) => ({
        id: keyword.id,
        name: keyword.name,
      })),
    };

    res.status(200).json({ serie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSerieSeason = async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const data = await TmdbService.getSerieSeason(id, seasonNumber);

    const season = {
      id: data.id,
      name: data.name,
      overview: data.overview,
      poster: data.poster_path,
      airDate: data.air_date,
      seasonNumber: data.season_number,
      vote: data.vote_average,

      episodes: (data.episodes || []).map((episode) => ({
        id: episode.id,
        name: episode.name,
        overview: episode.overview,
        still: episode.still_path,
        airDate: episode.air_date,
        episodeNumber: episode.episode_number,
        seasonNumber: episode.season_number,
        runtime: episode.runtime,
        vote: episode.vote_average,
        voteCount: episode.vote_count,
      })),
    };

    res.status(200).json({ season });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const addTvToList = async (req, res) => {
  try {
    const {
      serieId,
      listId,
      listName,
      title,
      overview,
      poster,
      vote,
      releaseDate,
      runtime,
    } = req.body;

    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id FROM media WHERE tmdbId = ? AND type = ?",
      [serieId, "tv"],
    );

    let serieDbId;

    if (rows.length === 0) {
      const [result] = await db.query(
        "INSERT INTO media (tmdbId, title, overview, poster, releaseDate, vote, runtime, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          serieId,
          title,
          overview,
          poster,
          releaseDate,
          vote,
          runtime ?? null,
          "tv",
        ],
      );

      serieDbId = result.insertId;
    } else {
      serieDbId = rows[0].id;
    }

    let targetListId;

    if (listId) {
      const [list] = await db.query(
        "SELECT id FROM lists WHERE id = ? AND user_id = ?",
        [listId, userId],
      );

      if (list.length === 0) {
        return res.status(404).json({ message: "List not found" });
      }

      targetListId = list[0].id;
    } else {
      const STATUS_LISTS = ["Watchlist", "Watching", "Watched"];

      if (STATUS_LISTS.includes(listName)) {
        const otherLists = STATUS_LISTS.filter((name) => name !== listName);

        const [conflicts] = await db.query(
          `SELECT l.name
           FROM list_items li
           JOIN lists l ON l.id = li.list_id
           WHERE l.user_id = ? AND l.media_type = ? AND l.name IN (?, ?) AND li.media_id = ?`,
          [userId, "tv", otherLists[0], otherLists[1], serieDbId],
        );

        if (conflicts.length > 0) {
          const conflictList = conflicts[0].name;
          return res.status(409).json({
            message: `Serie already exists in ${conflictList}. Remove it from ${conflictList} before adding it to ${listName}.`,
          });
        }
      }

      const [list] = await db.query(
        "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
        [userId, listName, "tv"],
      );

      if (list.length === 0) {
        return res.status(404).json({
          message: "List not found",
        });
      }

      targetListId = list[0].id;
    }

    const [existing] = await db.query(
      "SELECT id FROM list_items WHERE list_id = ? AND media_id = ?",
      [targetListId, serieDbId],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Serie is already in this list",
      });
    }

    await db.query("INSERT INTO list_items (list_id, media_id) VALUES (?, ?)", [
      targetListId,
      serieDbId,
    ]);

    return res.status(201).json({
      message: "Serie added to list",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getSeriesFromList = async (req, res) => {
  try {
    const listName = req.params.listName;
    const userId = req.user.id;

    const [result] = await db.query(
      "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
      [userId, listName, "tv"],
    );
    const listId = result[0].id;

    const [rows] = await db.query(
      "SELECT * FROM list_items LEFT JOIN media ON list_items.media_id = media.id WHERE list_id = ? ",
      [listId],
    );

    const [favoriteRows] = await db.query(
      `SELECT m.tmdbId
       FROM list_items li
       JOIN media m ON m.id = li.media_id
       JOIN lists l ON l.id = li.list_id
       WHERE l.user_id = ? AND l.name = ? AND l.media_type = ?`,
      [userId, "Favorites", "tv"],
    );

    const favoriteIds = new Set(favoriteRows.map((row) => row.tmdbId));

    const movies = rows.map((serie) => ({
      ...serie,
      favorites: favoriteIds.has(serie.tmdbId),
    }));

    res.status(200).json({ movies });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const moveTvToList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listName, serieId } = req.params;

    const STATUS_LISTS = ["Watchlist", "Watching", "Watched"];

    if (!STATUS_LISTS.includes(listName)) {
      return res.status(400).json({ message: "Invalid target list" });
    }

    const [media] = await db.query(
      "SELECT id FROM media WHERE tmdbId = ? AND type = ?",
      [serieId, "tv"],
    );

    if (media.length === 0) {
      return res.status(404).json({ message: "Serie not found" });
    }

    const serieDbId = media[0].id;

    const [lists] = await db.query(
      "SELECT id, name FROM lists WHERE user_id = ? AND name IN (?, ?, ?) AND media_type = ?",
      [userId, ...STATUS_LISTS, "tv"],
    );

    const target = lists.find((l) => l.name === listName);

    if (!target) {
      return res.status(404).json({ message: "List not found" });
    }

    const otherListIds = lists
      .filter((l) => l.name !== listName)
      .map((l) => l.id);

    if (otherListIds.length > 0) {
      await db.query(
        "DELETE FROM list_items WHERE media_id = ? AND list_id IN (?)",
        [serieDbId, otherListIds],
      );
    }

    const [inTarget] = await db.query(
      "SELECT id FROM list_items WHERE list_id = ? AND media_id = ?",
      [target.id, serieDbId],
    );

    if (inTarget.length === 0) {
      await db.query(
        "INSERT INTO list_items (list_id, media_id) VALUES (?, ?)",
        [target.id, serieDbId],
      );
    }

    return res.status(200).json({ message: `Serie moved to ${listName}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeTvFromList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listName, serieId } = req.params;

    const [list] = await db.query(
      "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
      [userId, listName, "tv"],
    );

    if (list.length === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    const listId = list[0].id;

    const [media] = await db.query(
      "SELECT id FROM media WHERE tmdbId = ? AND type = ?",
      [serieId, "tv"],
    );

    if (media.length === 0) {
      return res.status(404).json({ message: "Serie not found" });
    }

    const serieDbId = media[0].id;

    const [result] = await db.query(
      "DELETE FROM list_items WHERE list_id = ? AND media_id = ?",
      [listId, serieDbId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Serie is not in this list" });
    }

    return res.status(200).json({ message: "Serie removed from list" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSeriesFromListById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listId } = req.params;

    const [lists] = await db.query(
      "SELECT id, user_id, name, media_type, is_default, is_public FROM lists WHERE id = ?",
      [listId],
    );

    if (lists.length === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    const list = lists[0];
    const isOwner = list.user_id === userId;

    if (!isOwner && !list.is_public) {
      return res.status(403).json({ message: "This list is private" });
    }

    const [rows] = await db.query(
      `SELECT m.tmdbId, m.title, m.overview, m.poster, m.releaseDate, m.vote, m.runtime, li.added_at
       FROM list_items li
       JOIN media m ON m.id = li.media_id
       WHERE li.list_id = ?
       ORDER BY li.added_at DESC`,
      [listId],
    );

    const [favoriteRows] = await db.query(
      `SELECT m.tmdbId
       FROM list_items li
       JOIN media m ON m.id = li.media_id
       JOIN lists l ON l.id = li.list_id
       WHERE l.user_id = ? AND l.name = ? AND l.media_type = ?`,
      [userId, "Favorites", "tv"],
    );

    const favoriteIds = new Set(favoriteRows.map((row) => row.tmdbId));

    const series = rows.map((serie) => ({
      ...serie,
      favorites: favoriteIds.has(serie.tmdbId),
    }));

    return res.status(200).json({
      list: {
        id: list.id,
        name: list.name,
        mediaType: list.media_type,
        isDefault: !!list.is_default,
        isPublic: !!list.is_public,
        isOwner,
        itemCount: series.length,
      },
      series,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeTvFromListById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listId, serieId } = req.params;

    const [lists] = await db.query(
      "SELECT id FROM lists WHERE id = ? AND user_id = ?",
      [listId, userId],
    );

    if (lists.length === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    const [media] = await db.query(
      "SELECT id FROM media WHERE tmdbId = ? AND type = ?",
      [serieId, "tv"],
    );

    if (media.length === 0) {
      return res.status(404).json({ message: "Serie not found" });
    }

    const serieDbId = media[0].id;

    const [result] = await db.query(
      "DELETE FROM list_items WHERE list_id = ? AND media_id = ?",
      [listId, serieDbId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Serie is not in this list" });
    }

    return res.status(200).json({ message: "Serie removed from list" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyTvLists = async (req, res) => {
  try {
    const userId = req.user.id;

    const [lists] = await db.query(
      "SELECT lists.*, COUNT(list_items.id) AS item_count FROM lists LEFT JOIN list_items ON list_items.list_id = lists.id WHERE lists.user_id = ? AND lists.media_type = ? AND lists.name NOT IN (?, ?, ?, ?) GROUP BY lists.id, lists.name",
      [userId, "tv", "Watched", "Watching", "Watchlist", "Favorites"],
    );
    res.status(200).json({ lists });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const createTvList = async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const userId = req.user.id;

    const [existing] = await db.query(
      "SELECT * FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
      [userId, name, "tv"],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "List with this name already exists" });
    }

    await db.query(
      "INSERT INTO lists(user_id,name,media_type,is_default,is_public) VALUES(?,?,?,?,?)",
      [userId, name, "tv", 0, isPublic],
    );
    return res.status(200).json({ message: "List successfully added." });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTvList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isPublic } = req.body;
    const userId = req.user.id;

    if (name) {
      const [existing] = await db.query(
        "SELECT * FROM lists WHERE name = ? AND user_id = ? AND media_type = ?",
        [name, userId, "tv"],
      );
      if (existing.length > 0) {
        return res
          .status(409)
          .json({ message: "List with this name already exist" });
      }
      await db.query("UPDATE lists SET name = ? WHERE id = ? ", [name, id]);
      res.status(200).json({ message: "List updated succcessfully" });
    }

    if (isPublic !== undefined) {
      const isPublicValue = Number(isPublic) ? 1 : 0;
      await db.query("UPDATE lists SET is_public = ? WHERE id = ? ", [
        isPublicValue,
        id,
      ]);
      res.status(200).json({ message: "List updated succcessfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTvList = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [deleted] = await db.query(
      "DELETE FROM lists WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({ message: "List deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const getOrCreateTvMedia = async (tvshowId) => {
  const [rows] = await db.query(
    "SELECT id FROM media WHERE tmdbId = ? AND type = ?",
    [tvshowId, "tv"],
  );
  if (rows.length > 0) return rows[0].id;

  const data = await TmdbService.getSingleSerie(tvshowId);
  const [result] = await db.query(
    "INSERT INTO media (tmdbId, title, overview, poster, releaseDate, vote, runtime, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      tvshowId,
      data.name,
      data.overview,
      data.poster_path,
      data.first_air_date || null,
      data.vote_average,
      null,
      "tv",
    ],
  );
  return result.insertId;
};

const ensureWatchingStatus = async (userId, tvshowId) => {
  const serieDbId = await getOrCreateTvMedia(tvshowId);

  const STATUS_LISTS = ["Watchlist", "Watching", "Watched"];
  const [statusRows] = await db.query(
    `SELECT l.id, l.name
       FROM list_items li
       JOIN lists l ON l.id = li.list_id
      WHERE l.user_id = ? AND l.media_type = ? AND l.name IN (?, ?, ?) AND li.media_id = ?`,
    [userId, "tv", ...STATUS_LISTS, serieDbId],
  );

  const current = new Set(statusRows.map((r) => r.name));
  if (current.has("Watching") || current.has("Watched")) return;

  const [watchingRows] = await db.query(
    "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
    [userId, "Watching", "tv"],
  );
  if (watchingRows.length === 0) return;

  const watchlistRow = statusRows.find((r) => r.name === "Watchlist");
  if (watchlistRow) {
    await db.query(
      "DELETE FROM list_items WHERE list_id = ? AND media_id = ?",
      [watchlistRow.id, serieDbId],
    );
  }

  await db.query(
    "INSERT IGNORE INTO list_items (list_id, media_id) VALUES (?, ?)",
    [watchingRows[0].id, serieDbId],
  );
};

const markEpisodeWatched = async (req, res) => {
  try {
    const userId = req.user.id;
    const tvshowId = req.params.id;
    const { seasonNumber, episodeNumber, poster } = req.body;

    if (seasonNumber === undefined || episodeNumber === undefined) {
      return res
        .status(400)
        .json({ message: "seasonNumber and episodeNumber are required" });
    }

    const mediaId = await getOrCreateTvMedia(tvshowId);

    await db.query(
      `INSERT IGNORE INTO user_episodes
        (user_id, tvshow_id, media_id, season_number, episode_number, poster, watched_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, tvshowId, mediaId, seasonNumber, episodeNumber, poster ?? null],
    );

    // Best-effort: starting to watch a show should mark it as "Watching".
    // A failure here must not fail the episode write.
    try {
      await ensureWatchingStatus(userId, tvshowId);
    } catch (statusErr) {
      console.error("ensureWatchingStatus failed:", statusErr);
    }

    const seasonData = await TmdbService.getSerieSeason(tvshowId, seasonNumber);
    const totalEpisodes = (seasonData.episodes || []).length;

    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM user_episodes
       WHERE user_id = ? AND tvshow_id = ? AND season_number = ?`,
      [userId, tvshowId, seasonNumber],
    );

    let seasonCompleted = false;
    if (totalEpisodes > 0 && count >= totalEpisodes) {
      await db.query(
        `INSERT IGNORE INTO user_seasons
          (user_id, tvshow_id, season_number, completed_at)
         VALUES (?, ?, ?, NOW())`,
        [userId, tvshowId, seasonNumber],
      );
      seasonCompleted = true;
    }

    return res.status(201).json({
      message: "Episode marked as watched",
      seasonCompleted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const unmarkEpisodeWatched = async (req, res) => {
  try {
    const userId = req.user.id;
    const tvshowId = req.params.id;
    const { seasonNumber, episodeNumber } = req.body;

    if (seasonNumber === undefined || episodeNumber === undefined) {
      return res
        .status(400)
        .json({ message: "seasonNumber and episodeNumber are required" });
    }

    const [result] = await db.query(
      `DELETE FROM user_episodes
       WHERE user_id = ? AND tvshow_id = ? AND season_number = ? AND episode_number = ?`,
      [userId, tvshowId, seasonNumber, episodeNumber],
    );

    if (result.affectedRows > 0) {
      await db.query(
        `DELETE FROM user_seasons
         WHERE user_id = ? AND tvshow_id = ? AND season_number = ?`,
        [userId, tvshowId, seasonNumber],
      );
    }

    return res.status(200).json({ message: "Episode unmarked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getShowProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const tvshowId = req.params.id;

    const [rows] = await db.query(
      `SELECT season_number FROM user_seasons
       WHERE user_id = ? AND tvshow_id = ?
       ORDER BY season_number`,
      [userId, tvshowId],
    );

    const completedSeasons = rows.map((row) => row.season_number);

    return res.status(200).json({ completedSeasons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWatchedEpisodes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: tvshowId, seasonNumber } = req.params;

    const [rows] = await db.query(
      `SELECT episode_number FROM user_episodes
       WHERE user_id = ? AND tvshow_id = ? AND season_number = ?
       ORDER BY episode_number`,
      [userId, tvshowId, seasonNumber],
    );

    const watchedEpisodes = rows.map((row) => row.episode_number);

    return res.status(200).json({ watchedEpisodes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllSeries,
  getSerieGenres,
  getSerieById,
  getSerieSeason,
  addTvToList,
  getSeriesFromList,
  getSeriesFromListById,
  removeTvFromList,
  removeTvFromListById,
  moveTvToList,
  getMyTvLists,
  createTvList,
  updateTvList,
  deleteTvList,
  markEpisodeWatched,
  unmarkEpisodeWatched,
  getShowProgress,
  getWatchedEpisodes,
};
