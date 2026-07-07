const {TmdbService} = require("../services/tmdb.service")

const getActorById = async (req, res) => {
    try {
        const {id} = req.params
        const data = await TmdbService.getActor(id);

        const actor = {
            tmdbId: data.id,
            name: data.name,
            biography: data.biography,
            birthday: data.birthday,
            deathday: data.deathday,
            gender: data.gender,
            placeOfBirth: data.place_of_birth,
            profile: data.profile_path,
            knownForDepartment: data.known_for_department,
            homepage: data.homepage,
            imdbId: data.imdb_id,
            popularity: data.popularity,
            alsoKnownAs: data.also_known_as,

            movieCredits: data.movie_credits.cast.map((movie) => ({
                tmdbId: movie.id,
                title: movie.title,
                originalTitle: movie.original_title,
                character: movie.character,
                overview: movie.overview,
                poster: movie.poster_path,
                backdrop: movie.backdrop_path,
                releaseDate: movie.release_date,
                vote: movie.vote_average,
                voteCount: movie.vote_count,
                popularity: movie.popularity,
                genreIds: movie.genre_ids,
                order: movie.order,
            })),

            tvCredits: data.tv_credits.cast.map((show) => ({
                tmdbId: show.id,
                name: show.name,
                originalName: show.original_name,
                character: show.character,
                overview: show.overview,
                poster: show.poster_path,
                backdrop: show.backdrop_path,
                firstAirDate: show.first_air_date,
                vote: show.vote_average,
                voteCount: show.vote_count,
                popularity: show.popularity,
                genreIds: show.genre_ids,
                episodeCount: show.episode_count,
            })),

            images: data.images.profiles.map((image) => image.file_path),

            externalIds: {
                imdb: data.external_ids.imdb_id,
                wikidata: data.external_ids.wikidata_id,
                facebook: data.external_ids.facebook_id,
                instagram: data.external_ids.instagram_id,
                tiktok: data.external_ids.tiktok_id,
                twitter: data.external_ids.twitter_id,
                youtube: data.external_ids.youtube_id,
            },
        };

        res.status(200).json({actor})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server Error"})
    }
}

module.exports = {getActorById}
