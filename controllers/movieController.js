import { Movie } from '../models/movieModel';
/* import axios from 'axios'; */

import { MovieLocation } from '../models/movieModel'
/* import { OmdbMovie } from '../models/movieModel'; */

// desc: Get all movies
// route: GET /movies
// access: PUBLIC
export const getFreeMovies = async (req, res) => {
  try {
    const movieList = await MovieLocation.find({})
  
      if (movieList.length) {
        res.status(200).json({
          success: true,
          message: `First 10 movies are free`,
          body: {
            movieList: movieList.slice(0,10)
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
};

// Desc: Get all authorized movies
// route: GET /movies/auth
// access: PRIVATE
export const getAllMovies = async (req, res) => {
  try {
    const fullMovieList = await MovieLocation.find();
  
      if (fullMovieList.length) {
        res.status(200).json({
          success: true,
          message: `Found ${fullMovieList.length} member exclusive movies`,
          body: {
            movieList: fullMovieList,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Failed to fetch movies. Log in for full access.',
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
};

// desc: Get all movies
// route: GET /movies
// access: PRIVATE
/* export const getAllMovies = async (req, res) => {
  const titles = ['Taste%20of%20Cherry', 'Babyteeth', 'What%20Time%20Is%20It%20There?', 'Amores%20Perros', 'The%20Return', 'City%20of%20God', 'Atlantique', 'Rosetta', 'Beau%20Travail', 'Videodrome'];
  try {
    for (const title of titles) {
    const response = await axios.get(`https://www.omdbapi.com/?t=${title}&apikey=${process.env.API_KEY}&`);
    const item = response.data;

    let existingMovie = await OmdbMovie.findOne({ Title: item.Title });
    
    if (existingMovie) {
   
      existingMovie.Year = item.Year;
  
      await existingMovie.save();
    } else {


      const movieLocation = await MovieLocation.find({});

    
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
          movie_location: movieLocation._id
        });
        await newMovie.save();
    }
  }


      const movieList = await OmdbMovie.find({}).populate('movie_location');
    
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
} */

// desc: Set movies
// route: POST /movies
// access: PRIVATE
export const postMovies = async (req, res) => {
  try {
    /* const { title, location, movie_location_still } = req.body; */
    /* const movie = new MovieLocation({ title, location, movie_location_still }) */
    const newMovie = new MovieLocation(req.body);
    const savedMovie = await newMovie.save();

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
        message: `Found the movie: ${singleMovie.title}`,
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

// desc: Post new movie
// route: POST /savedmovies/:id
// access: PRIVATE
export const postNewMovie = async (req, res) => {
  try {
    const singleMovie = await MovieLocation.findById(req.params.id);
    
    if (!singleMovie) {
      const newMovie = new MovieLocation(req.body);
      const savedMovie = await newMovie.save();

      res.status(200).json({
        success: true,
        message: `Added new movie: ${newMovie.title}`,
        body: {
          NewMovie: savedMovie
        },
      });
    } else {
      res.status(404).json({
          success: false,
          message: 'Failed to update movie',
          body: {},
      });
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: err.message
    });
  }
};

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
        message: `Updated movie ${singleMovie.title}`,
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
};