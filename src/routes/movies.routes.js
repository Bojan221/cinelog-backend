const express = require('express')
const router = express.Router()
const {getAllMovies} = require('../controllers/movie.controller')

router.get('/allMovies',getAllMovies)


module.exports = router;