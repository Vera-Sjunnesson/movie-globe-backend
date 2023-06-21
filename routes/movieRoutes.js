import express from 'express';
const movieRouter = express.Router();
import { getFreeMovies, getAllMovies, postMovies, getMovie, saveMovie, getAllSavedMovies, deleteSavedMovie, addComment } from '../controllers/movieController';
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
movieRouter.get("/start", getFreeMovies);

//Get all private movies - Private
movieRouter.get("/", authentification, getAllMovies);

//Post movies - Private
movieRouter.post("/", authentification, postMovies);

// Save and delete saved movies - Private
movieRouter.route("/:id")
  .all(authentification)
  .get(getMovie)
  .put(saveMovie)
  .delete(deleteSavedMovie);

//Add comment - Private
movieRouter.put("/:id/addcomment", authentification, addComment);

// get all saved movies - Private
movieRouter.route("/savedmovies") 
  .all(authentification)
  .get(getAllSavedMovies)

export default movieRouter;