import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRouter from './routes/movieRoutes';
import userRouter from './routes/userRoutes';
import User from './models/userModel';
import { MovieLocation } from './models/movieModel';
import { OmdbMovie } from './models/movieModel';
import movieJson from './data/movies.json';
import { movieFetch } from "./movieFetch";


dotenv.config();


const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/movie-globe'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndPoints = require('express-list-endpoints');


/* Middlewares */
app.use(cors());
app.use(express.json());

// Authenticate the user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  try {
    const user = await User.findOne({accessToken});
    if (user) {
      next();
    } else {
      res.status(400).json({
        success: false,
        response: {
          message: "User not logged in",
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
};

/* Resetting the db  // Runs with RESET_DB=true (from .env) */
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await MovieLocation.deleteMany();
    await OmdbMovie.deleteMany();
    movieJson.forEach(movie => {
      const newMovie = new MovieLocation(movie);
      newMovie.save();
    })
  };
  resetDatabase();
  movieFetch();
};

/********* GET REQUESTS **********/
app.get("/", (req, res) => {
  const message = "Welcome to the MovieGlobe API"
  const endpoints = (listEndPoints(app))

  res.send({
    body: {
      message,
      endpoints
    }
  });
});

app.use("/movies", movieRouter)

// Register or login user
app.use("/user", userRouter);

/* Restricted endpoints by authenticateUser() */
app.get("/vipmovies", authenticateUser);
app.get("/vipmovies", async (req, res) => {
  try { 
    res.status(200).json({
      success: true,
      response: {
        movies: 'Returns full access movielist'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: {
        message: error
      }
    }); 
  };
});

//ENDPOINTS accessed WITHOUT accessToken:

//User model:
//("/register") - DONE!
//("/login") - DONE!

//Movies model:
//app.get("/movies" - version for landing page with fewer movies - and a few query values/filters, such as genre

//ENDPOINTS accessed WITH accessToken:

//Movies model:
//app.get("/movies" - version with more movies by default  - and a lot of query values/filters
//app.post("/movies" - User can post movies with accessToken
//app.get("/movies/:id" - get one specific movies
//app.get("/movies/:id/save" - User can save a movie
//app.post("/movies/:createcollection" - User can create collection
//app.get("/movies/collections" - get user's collections
//app.get("/movies/collections/movies" - get movies in collection
//Skriv den här ser inte .env:
//Comments model:
//app.post("/comments" - User can post comment on movies
//app.get("/comments" - Get user comments

//Review model:
//app.post("/reviews" - User can review movies



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
