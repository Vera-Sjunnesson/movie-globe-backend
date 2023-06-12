import express from 'express';
const movieRouter = express.Router();
import { getFreeMovies, getAllMovies, postMovies, saveMovie, getAllSavedMovies, deleteSavedMovie } from '../controllers/movieController';
import { User } from '../models/userModel';

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

//Get all public movies - Public
movieRouter.get("/", getFreeMovies);

//Post movies - Private
movieRouter.post("/", authentification, postMovies);

//Get all private movies - Private
movieRouter.delete("/auth", authentification, getAllMovies);

// Save and delete saved movies - Private
movieRouter.route("/:id")
  .all(authentification)
  .put(saveMovie)
  .delete(deleteSavedMovie);

// get all saved movies - Private
movieRouter.route("/savedmovies") 
  .all(authentification)
  .get(getAllSavedMovies)

export default movieRouter;