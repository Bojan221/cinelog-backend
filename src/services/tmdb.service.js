const apiClient = require("../config/axios");

const TmdbService = {
  getAllMovies: async () => {
    try {
      const result = await apiClient.get("/discover/movie");

      return result.data
    } catch (err) {
      console.log(err)
    }
  },
};

module.exports = { TmdbService };
