const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovieGenres,
  getMovieById,
  addMovieToList,
  getMoviesFromList,
  removeMovieFromList,
  moveToWatched,
  getMyLists,
  createList
} = require("../controllers/movie.controller");

// Discovery / details
router.get("/genres", getMovieGenres);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// User lists
router.post("/lists", addMovieToList);
router.post("/lists/create", createList);
router.get("/lists/myLists", getMyLists);
router.get("/lists/:listName", getMoviesFromList);
router.delete("/lists/:listName/:movieId", removeMovieFromList);
router.patch("/lists/watched/:movieId", moveToWatched);

module.exports = router;
