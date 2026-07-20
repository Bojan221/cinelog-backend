const express = require("express");
const router = express.Router();
const {
  getAllSeries,
  getSerieGenres,
  getSerieById,
  getSerieSeason,
  getSerieEpisode,
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
} = require("../controllers/tv.controller");

router.get("/", getAllSeries);
router.get("/genres", getSerieGenres);

// Episode / season tracking
router.get("/:id/progress", getShowProgress);
router.get("/:id/season/:seasonNumber/watched", getWatchedEpisodes);
router.post("/:id/episodes/watched", markEpisodeWatched);
router.delete("/:id/episodes/watched", unmarkEpisodeWatched);

router.get(
  "/:id/season/:seasonNumber/episode/:episodeNumber",
  getSerieEpisode,
);
router.get("/:id/season/:seasonNumber", getSerieSeason);
router.get("/:id", getSerieById);

//User lists
router.post("/lists", addTvToList);
router.post("/lists/create", createTvList);
router.patch("/lists/update/:id", updateTvList);
router.delete("/lists/delete/:id", deleteTvList);
router.get("/lists/myLists", getMyTvLists);
router.get("/lists/byId/:listId", getSeriesFromListById);
router.delete("/lists/byId/:listId/:serieId", removeTvFromListById);
router.get("/lists/:listName", getSeriesFromList);
router.patch("/lists/:listName/:serieId", moveTvToList);
router.delete("/lists/:listName/:serieId", removeTvFromList);

module.exports = router;
