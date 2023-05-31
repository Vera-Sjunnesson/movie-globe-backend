import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import movieJson from './data/movies.json';
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


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const MovieSchema = new Schema({
  id: Number,
  title: String,
  key_scene: String,
  location_image: String,
  coordinates: [Number] // [longitude, latitude]
})

const Movie = mongoose.model("Movie", MovieSchema);

// Resetting the db  // Needs to be run with RESET_DB=true
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

/* const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 30
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
});

const User = mongoose.model("User", UserSchema); */

// Start defining your routes here
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
      error: err.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
