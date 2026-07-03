const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

router.use("/auth", require("./auth.routes"));
router.use("/movies",require("./movies.routes"))
// authMiddleware dodati kad se zavrsi testiranje 
module.exports = router;
