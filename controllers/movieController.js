import axios from 'axios';

import { MovieLocation } from '../models/movieModel'
import { OmdbMovie } from '../models/movieModel';

// desc: Get all movies
// route: GET /movies
// access: PRIVATE
/* export const getAllMovies = async (req, res) => {
  try {
    const movieList = await OmdbMovie.find({}).populate('Movie_Location')
  
      if (movieList.length) {
        res.status(200).json({
          success: true,
          message: `Found ${movieList.length} movies`,
          body: {
            movieList: movieList,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Failed to fetch movies',
          body: {},
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch movies',
        error: err.message
      });
    }
} */

// desc: Get all movies
// route: GET /movies
// access: PRIVATE
export const getAllMovies = async (req, res) => {
  const titles = ['Taste%20of%20Cherry', 'Babyteeth', 'What%20Time%20Is%20It%20There?', 'Amores%20Perros', 'The%20Return', 'City%20of%20God', 'Atlantique', 'Rosetta', 'Beau%20Travail', 'Videodrome'];
  try {
    for (const title of titles) {
    const response = await axios.get(`https://www.omdbapi.com/?t=${title}&apikey=${process.env.API_KEY}&`);
    const item = response.data;

    // Check if a movie with the same title already exists in the collection
    let existingMovie = await OmdbMovie.findOne({ Title: item.Title });
    
    if (existingMovie) {
      // Handle the case when the movie already exists
      existingMovie.Year = item.Year;
      // Update other fields as needed
      /* await existingMovie.populate('movie_location') */
      /* existingMovie = await OmdbMovie.findOne({ Title: item.Title }).populate('Movie_Location'); */
      await existingMovie.save();
    } else {


      const movieLocation = await MovieLocation.find({});

      if (movieLocation) {
        // If the MovieLocation document is found
        const movieLocationId = movieLocation._id;

        // Create a new movie document with the fetched data
        const newMovie = new OmdbMovie({
          Title: item.Title,
          Year: item.Year,
          Rated: item.Rated,
          Released: item.Released,
          Runtime: item.Runtime,
          Genre: item.Genre,
          Director: item.Director,
          Writer: item.Writer,
          Actors: item.Actors,
          Plot: item.Plot,
          Language: item.Language,
          Country: item.Country,
          Awards: item.Awards,
          Poster: item.Poster,
          Ratings: item.Ratings,
          Metascore: item.Metascore,
          imdbRating: item.imdbRating,
          imdbVotes: item.imdbVotes,
          imdbID: item.imdbID,
          Type: item.Type,
          DVD: item.DVD,
          BoxOffice: item.BoxOffice,
          Production: item.Production,
          Website: item.Website,
          Response: item.Response,
          movie_location: movieLocationId,
        });
        await newMovie.save();
        /* await newMovie.findOne({_id}).populate({path: 'movie_location'}) */
      } else {
        // If the MovieLocation document is not found, handle the case accordingly
        console.log('MovieLocation not found');
      }
    }
  }

      // Retrieve the updated movie list after saving the movies
      const movieList = await OmdbMovie.find({}).populate({path: "movie_location", model: 'MovieLocation', select: "coordinates"}).exec()
    if (movieList) {
      res.status(200).json({
        success: true,
        message: `Found ${movieList.length} movies`,
        body: {
          movieList: movieList,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Failed to fetch movies',
        body: {},
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: err.message
    });
  }
}

// desc: Set movies
// route: POST /movies
// access: PRIVATE
export const postMovies = async (req, res) => {
  try {
    const { title, location, movie_location_still } = req.body;
    const movie = new MovieLocation({ title, location, movie_location_still })
    const savedMovie = await movie.save()

      res.status(201).json({
      success: true,
      response: savedMovie,
      message: "Movie created successfully"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch movies',
      error: err.message
    });
  }
}

// desc: Get a movie
// route: GET /movies/:id
// access: PRIVATE
export const getMovie = async (req, res) => {
  try {
    const singleMovie = await MovieLocation.findById(req.params.id);
    if (singleMovie) {
      res.status(200).json({
        success: true,
        message: `Found movie ${singleMovie}`,
        body: {
          singleMovie: singleMovie,
        },
      })
    } else {
      res.status(404).json({
          success: false,
          message: 'Failed to find movie',
          body: {},
      })
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      message: 'Failed to find movie',
      error: err.message
    })
  }
}

// desc: Update a movie
// route: PUT /movies/:id
// access: PRIVATE
export const updateMovie = async (req, res) => {
  try {
    const { title, location, movie_location_still } = req.body;
    const singleMovie = await MovieLocation.findById(req.params.id);
    
    if (singleMovie) {
      singleMovie.title = title;
      singleMovie.location = location;
      singleMovie.movie_location_still = movie_location_still;

      const updatedMovie = await singleMovie.save();

      res.status(200).json({
        success: true,
        message: `Updated movie ${singleMovie}`,
        body: {
          updatedMovie: updatedMovie,
        },
      })
    } else {
      res.status(404).json({
          success: false,
          message: 'Failed to update movie',
          body: {},
      })
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: err.message
    })
  }
}

// desc: Delete a movie
// route: DELETE /movies/:id
// access: PRIVATE
export const deleteMovie = async (req, res) => {
  try {
    const movieById = await MovieLocation.findByIdAndDelete(req.params.id);
    if (movieById) {
      res.status(200).json({
        success: true,
        message: `Deleted movie with id ${movieById}`,
        body: {
          movieById: movieById,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Failed to delete movie',
        body: {},
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: err.message
    });
  }
}
