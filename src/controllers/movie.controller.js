const {TmdbService} = require('../services/tmdb.service')

const getAllMovies = async(req,res) => { 
    try {
        const movies = await TmdbService.getAllMovies()
        res.status(200).json({data:movies})
    } catch(err) {
        return res.status(500).json({message:"Server error"})
    }
}

module.exports = {getAllMovies}