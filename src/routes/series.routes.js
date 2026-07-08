const express = require("express");
const router = express.Router();
const { getAllSeries, getSerieGenres, getSerieById } = require("../controllers/tv.controller");

router.get("/", getAllSeries);
router.get("/genres", getSerieGenres);
router.get("/:id", getSerieById);

module.exports = router;
