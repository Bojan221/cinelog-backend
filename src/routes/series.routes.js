const express = require("express");
const router = express.Router();
const {
  getAllSeries,
  getSerieGenres,
  getSerieById,
  getSerieSeason,
  addTvToList,
  getSeriesFromList,
  removeTvFromList,
  moveTvToList,
} = require("../controllers/tv.controller");

router.get("/", getAllSeries);
router.get("/genres", getSerieGenres);
router.get("/:id/season/:seasonNumber", getSerieSeason);
router.get("/:id", getSerieById);

//User lists
router.get("/lists/:listName", getSeriesFromList);
router.post("/lists", addTvToList);
router.patch("/lists/:listName/:serieId", moveTvToList);
router.delete("/lists/:listName/:serieId", removeTvFromList);

module.exports = router;
