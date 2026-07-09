const apiClient = require("../config/axios");

const SORT_MAP = {
  popular: "popularity.desc",
  newest: "release_date.desc",
  rating: "vote_average.desc",
};

const TmdbService = {
  getAllMovies: async (searchQuery = {}) => {
    const { page = 1, search, sort, genre, rating } = searchQuery;

    const params = { page };

    if (search) {
      params.query = search;
      const result = await apiClient.get("/search/movie", { params });
      return result.data;
    }

    if (SORT_MAP[sort]) params.sort_by = SORT_MAP[sort];
    if (genre) params.with_genres = genre;

    const result = await apiClient.get("/discover/movie", { params });
    return result.data;
  },
  getMovieGenres: async () => {
    const result = await apiClient.get("/genre/movie/list?language=en");
    return result.data;
  },
  getSingleMovie: async(id)=> { 
    const result = await apiClient.get(`/movie/${id}?append_to_response=credits,videos,images,recommendations,similar,reviews,keywords`)
    return result.data
  },
  getActor: async(id) => { 
    const result = await apiClient.get(`/person/${id}?append_to_response=movie_credits,tv_credits,images,external_ids`)
    return result.data
  },
  getAllSeries : async(searchQuery={}) => {
    const { page = 1, search, sort, genre, rating } = searchQuery;

    const params = { page };

    if (search) {
      params.query = search;
      const result = await apiClient.get("/search/tv", { params });
      return result.data;
    }

    if (SORT_MAP[sort]) params.sort_by = SORT_MAP[sort];
    if (genre) params.with_genres = genre;

    const result = await apiClient.get("/discover/tv", { params });
    return result.data;

  },
  getSerieGenres: async () => {
    const result = await apiClient.get("/genre/tv/list?language=en");
    return result.data;
  },
  getSingleSerie: async(id) => {
    const result = await apiClient.get(`/tv/${id}?language=en-US&append_to_response=aggregate_credits,content_ratings,external_ids,images,keywords,recommendations,reviews,similar,videos`)
    return result.data;
  },
  getSerieSeason: async (id, seasonNumber) => {
    const result = await apiClient.get(
      `/tv/${id}/season/${seasonNumber}?language=en-US`
    );
    return result.data;
  }
};

module.exports = { TmdbService };
