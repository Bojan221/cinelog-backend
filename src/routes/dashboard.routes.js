const express = require("express");
const router = express.Router();
const { getRecentWatchedTv,topMedia, getUpNext } = require("../controllers/dashboard.controller");

router.get("/recentlyTvEpisode", getRecentWatchedTv);
router.get("/topMedia", topMedia);
router.get("/upNext", getUpNext);

module.exports = router;
