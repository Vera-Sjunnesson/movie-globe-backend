import { Movie } from '../models/movieModel'

// desc: Get all movies
// route: GET /movies
// access: PRIVATE
export const getAllMovies = async (req, res) => {
  try {
    const movieList = await Movie.find();
  
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
}

// desc: Set movies
// route: POST /movies
// access: PRIVATE
export const postMovies = async (req, res) => {
  const { title, key_scene, location_image } = req.body;
  const movie = new Movie({ title, key_scene, location_image })
  const savedMovie = await movie.save()
  try {
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
// route: POST /movies/:id
// access: PRIVATE
export const getMovie = async (req, res) => {
  try {
    const singleMovie = await Movie.findById(req.params.id);
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
    const singleMovie = await Movie.findById(req.params.id);
    if (singleMovie) {
      res.status(200).json({
        success: true,
        message: `Updated movie ${singleMovie}`,
        body: {
          singleMovie: singleMovie,
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
    const movieById = await Movie.findByIdAndDelete(req.params.id);
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
