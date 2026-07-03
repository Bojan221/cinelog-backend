const express = require('express')
const router = express.Router()
const {getAllMovies, getMovieGenres, getMovieById} = require('../controllers/movie.controller')

router.get('/allMovies',getAllMovies)
router.get('/movieGenres',getMovieGenres)
router.get('/movieDetails/:id', getMovieById)

module.exports = router;