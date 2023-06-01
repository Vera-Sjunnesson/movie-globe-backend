import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import movieJson from './data/movies.json';
import { Movie } from "./models/movieModel";
import { User } from "./models/userModel";
import dotenv from 'dotenv';
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

// moved schemas to movieModel and userModel

/* Resetting the db  // Runs with RESET_DB=true (from .env) */
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Movie.deleteMany();
    movieJson.forEach(movie => {
      const newMovie = new Movie(movie);
      newMovie.save();
    })
  };
  resetDatabase();
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

// get all movies
app.get('/movies', async (req, res) => {
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
});

/******* POST REQUESTS ***********/
//POST movie to database
app.post("/movies", async (req, res) => {
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
});

// Register user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  // At least one digit
  // At least one lowercase letter
  // At least one uppercase letter
  // At least 6 characters long

  //Checks if valid password
   if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      response: {
        message: "Password needs to be at least 6 characters, and include one number, one uppercase letter and one lowercase letter."
      }
    });
  };
  // checks username available
  try {
    const usernameTaken = await User.findOne({ username: username});
    if (usernameTaken) {
      return res.status(400).json({
        success: false,
        response: {
          message: "Username is already taken"
        }
      });
    };

    // encryption
    const salt = bcrypt.genSaltSync();

    const newUser = await new User({
      username: username,
      password: bcrypt.hashSync(password, salt)
    }).save();

     res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        id: newUser._id,
        accessToken: newUser.accessToken,
        message: "User successfully created"
      }
    });

  } catch (err) {
     res.status(400).json({
      success: false,
      response: error
    });
  };
});

/* LOGIN USER */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({username});
    // checks password
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          accessToken: user.accessToken,
          message: "User logged in"
        }
      })
    } else {
      res.status(404).json({
        success: false,
        response: {
          message: "Credentials do not match",
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    })
  }
});

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

//Comments model:
//app.post("/comments" - User can post comment on movies
//app.get("/comments" - Get user comments

//Review model:
//app.post("/reviews" - User can review movies



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
