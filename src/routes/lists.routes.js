const express = require("express");
const router = express.Router();
const {getPublicLists,getListById} = require("../controllers/list.controller")

router.get("/public",getPublicLists )
router.get("/:id",getListById)

module.exports = router;