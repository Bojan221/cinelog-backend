const express = require("express");
const router = express.Router();
const { addVote, updateVote } = require("../controllers/vote.controller");

router.post("/add", addVote);
router.post("/update", updateVote);

module.exports = router;
