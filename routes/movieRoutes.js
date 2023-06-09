import express from 'express';
const movieRouter = express.Router();
import { getFreeMovies, postMovies, getMovie, updateMovie, deleteMovie } from '../controllers/movieController';

// See controller-functions for actual GET/POST-request
// For example getAllMovies in movieController

//Get all movies
movieRouter.get("/", getFreeMovies);

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