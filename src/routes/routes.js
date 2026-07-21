const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

router.use("/auth", require("./auth.routes"));
router.use("/movies",authMiddleware,require("./movies.routes"))
router.use("/series",authMiddleware,require("./series.routes"))
router.use("/actors",authMiddleware,require("./actors.routes"))
router.use("/dashboards",authMiddleware,require("./dashboard.routes"))
router.use("/lists",authMiddleware,require("./lists.routes"))

module.exports = router;
