import express from 'express';
const movieRouter = express.Router();
import { getAllMovies, postMovies, getMovie, updateMovie, deleteMovie } from '../controllers/movieController';

// See controller-functions for actual GET/POST-request
// For example getAllMovies in movieController

//Get all movies
movieRouter.get('/', getAllMovies);

//Post movies
movieRouter.post("/", postMovies);

//Get a movie
movieRouter.get("/:id", getMovie);

//Update a movie
movieRouter.put("/:id", updateMovie);

//delete a movie
movieRouter.delete("/:id", deleteMovie)

export default movieRouter;