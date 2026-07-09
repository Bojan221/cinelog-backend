const express = require("express");
const router = express.Router();
const { getAllSeries, getSerieGenres, getSerieById, getSerieSeason } = require("../controllers/tv.controller");

router.get("/", getAllSeries);
router.get("/genres", getSerieGenres);
router.get("/:id/season/:seasonNumber", getSerieSeason);
router.get("/:id", getSerieById);

module.exports = router;
