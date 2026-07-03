const {TmdbService} = require('../services/tmdb.service')

const getAllMovies = async(req,res) => { 
    try {
        const searchQuery = req.query
        const data = await TmdbService.getAllMovies(searchQuery)
        const movies = data.results.map(movie => ({
            tmdbId:movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: movie.poster_path,
            releaseDate: movie.release_date,
            vote: movie.vote_average,

        }))
        res.status(200).json({page:data.page, movies:movies, totalPages:data.total_pages})
    } catch(err) {
        return res.status(500).json({message:"Server error"})
    }
}

const getMovieGenres = async(req,res) => { 
    try {
        const genres = await TmdbService.getMovieGenres()
        res.status(200).json({genres: genres.genres})
    }catch(err) { 
        res.status(500).json({message:"Server error"})
    }
}

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await TmdbService.getSingleMovie(id);

        const movie = {
            tmdbId: data.id,
            title: data.title,
            originalTitle: data.original_title,
            overview: data.overview,
            tagline: data.tagline,
            poster: data.poster_path,
            backdrop: data.backdrop_path,
            releaseDate: data.release_date,
            runtime: data.runtime,
            status: data.status,
            vote: data.vote_average,
            voteCount: data.vote_count,
            popularity: data.popularity,
            homepage: data.homepage,
            imdbId: data.imdb_id,

            genres: data.genres.map((genre) => ({
                id: genre.id,
                name: genre.name,
            })),

            productionCompanies: data.production_companies.map((company) => ({
                id: company.id,
                name: company.name,
                logo: company.logo_path,
            })),

            spokenLanguages: data.spoken_languages.map((language) => ({
                iso: language.iso_639_1,
                name: language.english_name,
            })),

            actors: data.credits.cast.slice(0, 15).map((actor) => ({
                id: actor.id,
                name: actor.name,
                character: actor.character,
                profile: actor.profile_path,
            })),

            director:
                data.credits.crew.find(
                    (person) => person.job === "Director"
                ) || null,

            writers: data.credits.crew
                .filter(
                    (person) =>
                        person.job === "Writer" ||
                        person.job === "Screenplay"
                )
                .map((person) => ({
                    id: person.id,
                    name: person.name,
                })),

            trailer:
                data.videos.results.find(
                    (video) =>
                        video.site === "YouTube" &&
                        video.type === "Trailer"
                ) || null,

            images: {
                posters: data.images.posters.map((image) => image.file_path),
                backdrops: data.images.backdrops.map((image) => image.file_path),
            },

            similarMovies: data.similar.results.map((movie) => ({
                tmdbId: movie.id,
                title: movie.title,
                poster: movie.poster_path,
                releaseDate: movie.release_date,
                vote: movie.vote_average,
            })),

            recommendedMovies: data.recommendations.results.map((movie) => ({
                tmdbId: movie.id,
                title: movie.title,
                poster: movie.poster_path,
                releaseDate: movie.release_date,
                vote: movie.vote_average,
            })),

            reviews: data.reviews.results.map((review) => ({
                id: review.id,
                author: review.author,
                rating: review.author_details.rating,
                avatar: review.author_details.avatar_path,
                content: review.content,
                createdAt: review.created_at,
            })),

            keywords: data.keywords.keywords.map((keyword) => ({
                id: keyword.id,
                name: keyword.name,
            })),
        };

        res.status(200).json({ movie });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {getAllMovies, getMovieGenres, getMovieById}