import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRouter from './routes/movieRoutes';
import userRouter from './routes/userRoutes';

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

/* app.get("/movies", getMovies) */
app.use("/movies", movieRouter)

// Register or login user
app.use("/user", userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});