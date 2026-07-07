const express = require("express");
const router = express.Router();
const { getActorById } = require("../controllers/actor.controller");

router.get("/:id", getActorById);

module.exports = router;
