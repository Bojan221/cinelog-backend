const express = require("express");
const router = express.Router();
const {getMediaComments,addComment} = require('../controllers/comment.controller')

router.get("/:id", getMediaComments)
router.post("/create", addComment)

module.exports = router;