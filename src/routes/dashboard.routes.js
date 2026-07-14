const express = require("express");
const router = express.Router();
const { getRecentWatchedTv,topMedia } = require("../controllers/dashboard.controller");

router.get("/recentlyTvEpisode", getRecentWatchedTv);
router.get("/topMedia", topMedia);

module.exports = router;
