const express = require('express')
const router = express.Router()
const {getAllMovies, getMovieGenres} = require('../controllers/movie.controller')

router.get('/allMovies',getAllMovies)
router.get('/movieGenres',getMovieGenres)

module.exports = router;