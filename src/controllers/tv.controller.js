const { TmdbService } = require("../services/tmdb.service");

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
        vote:serie.vote_average,
        backdrop: serie.backdrop_path,
        genres: serie.genre_ids
    }))
    res.status(200).json({ page: data.page, series: series, totalPages: data.total_pages  });
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

module.exports = { getAllSeries, getSerieGenres, getSerieById, getSerieSeason };
