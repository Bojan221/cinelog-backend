const express = require("express");
const router = express.Router();
const {
  getMediaComments,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.get("/:id", getMediaComments);
router.post("/create", addComment);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);
module.exports = router;
