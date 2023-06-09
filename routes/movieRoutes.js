import express from 'express';
const movieRouter = express.Router();
import { getFreeMovies, postMovies,/* , getMovie, updateMovie, */ deleteMovie, saveMovie, getAllSavedMovies } from '../controllers/movieController';
import { User } from '../models/userModel';
// See controller-functions for actual GET/POST-request
// For example getAllMovies in movieController

const authentification = async (req, res, next) => {
    const accessToken = req.header('Authorization');
    try {
      const user = await User.findOne({accessToken});
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          success: false,
          response: {
            message: "Please log in",
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error
      });
    };
}

//Get all movies
movieRouter.get("/", getFreeMovies);

//Post movies
movieRouter.post("/", postMovies);

movieRouter.route("/:id")
  .all(authentification)
  .put(saveMovie)
  .delete(deleteMovie);

  movieRouter.route("/savedmovies")
  .all(authentification)
  .get(getAllSavedMovies)

export default movieRouter;