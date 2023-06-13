import mongoose from 'mongoose';
import { User } from '../models/userModel';
import { MovieLocation } from '../models/movieModel'

// desc: Get all unauthorized movies
// route: GET /movies
// access: PUBLIC
export const getFreeMovies = async (req, res) => {
  try {
    const movieList = await MovieLocation.find({}).limit(10)
  
      if (movieList.length) {
        res.status(200).json({
          success: true,
          message: `First 5 movies are free`,
          body: {
            movieList: movieList
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
    const movieList = await MovieLocation.find({});
  
      if (movieList.length) {
        res.status(200).json({
          success: true,
          message: `Found ${movieList.length} member exclusive movies`,
          body: {
            movieList: movieList,
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

// desc: Set movies
// route: POST /movies
// access: PRIVATE
export const postMovies = async (req, res) => {
  try {
    const newMovieObject = req.body;
    const movie = new MovieLocation(newMovieObject)
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


// route: PUT /movies/:id
// access: PRIVATE
export const saveMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const accessToken = req.headers.authorization;

    const user = await User.findOne({ accessToken });

    if (!user) {
      return res.status(401).json({
        success: false,
        response: {
          message: "Invalid access token",
        }
      });
    }

    const movieToUpdate = await MovieLocation.findById(id);
    const existingId = movieToUpdate.LikedBy.find(userId => userId.equals(user._id));

    if (existingId) {
      res.status(200).json({
        success: false,
        message: 'Movie is already saved',
        body: {},
      });

    } else {
    if (movieToUpdate) {
      movieToUpdate.LikedBy.push(user._id);
      const updatedMovie = await movieToUpdate.save();

      res.status(201).json({
        success: true,
        message: `Updated ${updatedMovie.title}`,
        body: {
          updatedMovie: updatedMovie
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Failed to update movie',
        body: {},
      });
    }}
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: err.message
    });
  }
};

// route: GET /savedmovies
// access: PRIVATE
export const getAllSavedMovies = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const user = await User.findOne({ accessToken: accessToken });
    const savedMovies = await MovieLocation.find({ LikedBy: { $in: [user._id] } })

    if (savedMovies) {
      res.status(200).json({
        success: true,
        message: `Movies saved by ${user.username}`,
        body: {
          savedMovies: savedMovies
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Failed to list saved movies',
        body: {},
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to list saved movies',
      error: err.message
    });
  }
};

// desc: Delete a movie
// route: DELETE /movies/:id
// access: PRIVATE
export const deleteSavedMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const accessToken = req.headers.authorization;

    const user = await User.findOne({ accessToken });

    if (!user) {
      return res.status(401).json({
        success: false,
        response: {
          message: "Invalid access token",
        }
      });
    }

    const movieToUpdate = await MovieLocation.findById(id);

    if (movieToUpdate) {
      movieToUpdate.LikedBy = movieToUpdate.LikedBy.filter(userId => userId.toString() !== user._id.toString());
      const updatedMovie = await movieToUpdate.save();

      res.status(201).json({
        success: true,
        message: `Deleted ${updatedMovie.title}`,
        body: {
          updatedMovie: updatedMovie
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Failed to delete movie',
        body: {},
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: err.message
    });
  }
};



// desc: Update a movie
// route: PUT /movies/:id/update
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
// route: DELETE /movies/:id/delete
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