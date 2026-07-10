const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovieGenres,
  getMovieById,
  addMovieToList,
  getMoviesFromList,
  getMoviesFromListById,
  removeMovieFromList,
  removeMovieFromListById,
  moveToWatched,
  getMyLists,
  createList,
  updateList,
  deletelist
} = require("../controllers/movie.controller");

// Discovery / details
router.get("/genres", getMovieGenres);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// User lists
router.post("/lists", addMovieToList);
router.post("/lists/create", createList);
router.patch("/lists/update/:id", updateList);
router.delete("/lists/delete/:id", deletelist);
router.get("/lists/myLists", getMyLists);
router.get("/lists/byId/:listId", getMoviesFromListById);
router.delete("/lists/byId/:listId/:movieId", removeMovieFromListById);
router.get("/lists/:listName", getMoviesFromList);
router.delete("/lists/:listName/:movieId", removeMovieFromList);
router.patch("/lists/watched/:movieId", moveToWatched);

module.exports = router;
