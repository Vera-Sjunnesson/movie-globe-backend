import express from 'express';
const movieRouter = express.Router();
import { User } from '../models/userModel';
import { getFreeMovies, postMovies, getMovie, updateMovie, deleteMovie, getAllMovies } from '../controllers/movieController';

// See controller-functions for actual GET/POST-request
// For example getAllMovies in movieController

//Get all movies
movieRouter.get("/", getFreeMovies);

// Get all authorized movies
movieRouter.get("/auth", async (req, res, next) => {
    const accessToken = req.header('Authorization');
    try {
      const user = await User.findOne({accessToken});
      if (user) {
        console.log('user exists');
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
}, getAllMovies); // Why can't auth.js be used?

/* movieRouter.get('/test', getTestMovies); */

//Post movies
movieRouter.post("/", postMovies);

//Get a single movie
movieRouter.get("/:id", getMovie);

//Update a movie
movieRouter.put("/:id", updateMovie);

//delete a movie
movieRouter.delete("/:id", deleteMovie);

export default movieRouter;