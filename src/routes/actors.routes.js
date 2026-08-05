const express = require("express");
const router = express.Router();
const { getActorById,getPopularActors } = require("../controllers/actor.controller");

router.get("/list", getPopularActors);
router.get("/:id", getActorById);

module.exports = router;
