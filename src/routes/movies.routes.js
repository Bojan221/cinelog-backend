const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovieGenres,
  getMovieById,
  addMovieToList,
  getMoviesFromList,
} = require("../controllers/movie.controller");

// Discovery / details
router.get("/genres", getMovieGenres);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// User lists
router.post("/lists", addMovieToList);
router.get("/lists/:listName", getMoviesFromList);

module.exports = router;
