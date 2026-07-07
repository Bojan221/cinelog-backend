const { TmdbService } = require("../services/tmdb.service");
const db = require("../config/db");

// Frontend salje ljudski citljiva imena, baza ima kanonska imena lista
const LIST_NAME_MAP = {
  "watch list": "Watchlist",
  watchlist: "Watchlist",
  "watched list": "Watched",
  watched: "Watched",
  favorites: "Favorites",
  favourites: "Favorites",
};

const getAllMovies = async (req, res) => {
  try {
    const searchQuery = req.query;
    const data = await TmdbService.getAllMovies(searchQuery);
    const movies = data.results.map((movie) => ({
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      backdrop: movie.backdrop_path,
      poster: movie.poster_path,
      releaseDate: movie.release_date,
      vote: movie.vote_average,
    }));
    res
      .status(200)
      .json({ page: data.page, movies: movies, totalPages: data.total_pages });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMovieGenres = async (req, res) => {
  try {
    const genres = await TmdbService.getMovieGenres();
    res.status(200).json({ genres: genres.genres });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TmdbService.getSingleMovie(id);

    const movie = {
      tmdbId: data.id,
      title: data.title,
      originalTitle: data.original_title,
      overview: data.overview,
      tagline: data.tagline,
      poster: data.poster_path,
      backdrop: data.backdrop_path,
      releaseDate: data.release_date,
      runtime: data.runtime,
      status: data.status,
      vote: data.vote_average,
      voteCount: data.vote_count,
      popularity: data.popularity,
      homepage: data.homepage,
      imdbId: data.imdb_id,

      genres: data.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
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

      actors: data.credits.cast.slice(0, 15).map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path,
      })),

      director:
        data.credits.crew.find((person) => person.job === "Director") || null,

      writers: data.credits.crew
        .filter(
          (person) => person.job === "Writer" || person.job === "Screenplay",
        )
        .map((person) => ({
          id: person.id,
          name: person.name,
        })),

      trailer:
        data.videos.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer",
        ) || null,

      images: {
        posters: data.images.posters.map((image) => image.file_path),
        backdrops: data.images.backdrops.map((image) => image.file_path),
      },

      similarMovies: data.similar.results.map((movie) => ({
        tmdbId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        releaseDate: movie.release_date,
        vote: movie.vote_average,
      })),

      recommendedMovies: data.recommendations.results.map((movie) => ({
        tmdbId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        releaseDate: movie.release_date,
        vote: movie.vote_average,
      })),

      reviews: data.reviews.results.map((review) => ({
        id: review.id,
        author: review.author,
        rating: review.author_details.rating,
        avatar: review.author_details.avatar_path,
        content: review.content,
        createdAt: review.created_at,
      })),

      keywords: data.keywords.keywords.map((keyword) => ({
        id: keyword.id,
        name: keyword.name,
      })),
    };

    res.status(200).json({ movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const addMovieToList = async (req, res) => {
  try {
    const {
      movieId,
      listName,
      title,
      overview,
      poster,
      vote,
      releaseDate,
    } = req.body;

    const userId = req.user.id;

    const canonicalName =
      LIST_NAME_MAP[String(listName).trim().toLowerCase()] || listName;

    // Provera da li film postoji u tabeli media
    const [rows] = await db.query(
      "SELECT id FROM media WHERE tmdbId = ?",
      [movieId]
    );

    let movieDbId;

    if (rows.length === 0) {
      const [result] = await db.query(
        "INSERT INTO media (tmdbId, title, overview, poster, releaseDate, vote) VALUES (?, ?, ?, ?, ?, ?)",
        [movieId, title, overview, poster, releaseDate, vote]
      );

      movieDbId = result.insertId;
    } else {
      movieDbId = rows[0].id;
    }

    if (canonicalName === "Watchlist" || canonicalName === "Watched") {
      const secondList =
        canonicalName === "Watchlist" ? "Watched" : "Watchlist";

      const [otherList] = await db.query(
        "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
        [userId, secondList, "movie"]
      );

      if (otherList.length > 0) {
        const secondListId = otherList[0].id;

        const [existsInSecondList] = await db.query(
          "SELECT id FROM list_items WHERE list_id = ? AND media_id = ?",
          [secondListId, movieDbId]
        );

        if (existsInSecondList.length > 0) {
          return res.status(409).json({
            message: `Movie already exists in ${secondList}. Remove it from ${secondList} before adding it to ${canonicalName}.`,
          });
        }
      }
    }

    const [list] = await db.query(
      "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
      [userId, canonicalName, "movie"]
    );

    if (list.length === 0) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const listId = list[0].id;

    const [existing] = await db.query(
      "SELECT id FROM list_items WHERE list_id = ? AND media_id = ?",
      [listId, movieDbId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Movie is already in this list",
      });
    }

    await db.query(
      "INSERT INTO list_items (list_id, media_id) VALUES (?, ?)",
      [listId, movieDbId]
    );

    return res.status(201).json({
      message: "Movie added to list",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


const getMoviesFromList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listName } = req.params;

    const canonicalName =
      LIST_NAME_MAP[String(listName).trim().toLowerCase()] || listName;

    const [list] = await db.query(
      "SELECT id FROM lists WHERE user_id = ? AND name = ? AND media_type = ?",
      [userId, canonicalName, "movie"]
    );

    if (list.length === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    const listId = list[0].id;

    const [movies] = await db.query(
      `SELECT m.tmdbId, m.title, m.overview, m.poster, m.releaseDate, m.vote
       FROM list_items li
       JOIN media m ON m.id = li.media_id
       WHERE li.list_id = ?`,
      [listId]
    );

    return res.status(200).json({ list: canonicalName, movies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMovies,
  getMovieGenres,
  getMovieById,
  addMovieToList,
  getMoviesFromList,
};
