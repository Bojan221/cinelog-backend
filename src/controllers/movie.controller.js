const {TmdbService} = require('../services/tmdb.service')

const getAllMovies = async(req,res) => { 
    try {
        const searchQuery = req.query
        const movies = await TmdbService.getAllMovies(searchQuery)
        res.status(200).json({page:movies.page, movies:movies.results, totalPages:movies.total_pages})
    } catch(err) {
        return res.status(500).json({message:"Server error"})
    }
}

const getMovieGenres = async(req,res) => { 
    try {
        const genres = await TmdbService.getMovieGenres()
        res.status(200).json({gendres: genres.genres})
    }catch(err) { 
        res.status(500).json({message:"Server error"})
    }
}

module.exports = {getAllMovies, getMovieGenres}