import mongoose from 'mongoose';

const omdbSchema = mongoose.Schema({
    Title: String,
    Year: String,
    Rated: String,
    Released: String,
    Runtime: String,
    Genre: String,
    Director: String,
    Writer: String,
    Actors: String,
    Plot: String,
    Language: String,
    Country: String,
    Awards: String,
    Poster: String,
    Ratings: [{ Source: String, Value: String }],
    Metascore: String,
    imdbRating: String,
    imdbVotes: String,
    imdbID: String,
    Type: String,
    DVD: String,
    BoxOffice: String,
    Production: String,
    Website: String,
    Response: String,
});

const OmdbMovie = mongoose.model('OmdbMovie', omdbSchema);

const MovieSchema = mongoose.Schema({
  id: Number,
  title: String,
  key_scene: String,
  location_image: String,
  coordinates: [Number],
  omdbMovie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OmdbMovie'
  }
});

// Define a pre-save middleware on the MovieSchema to automatically match and set the omdbMovie reference
MovieSchema.pre('save', async function (next) {
  const movieTitle = this.title;

  // Find the corresponding OmdbMovie by title
  const omdbMovie = await OmdbMovie.findOne({ Title: movieTitle });

  if (omdbMovie) {
    // Set the omdbMovie reference in the Movie document
    this.omdbMovie = omdbMovie._id;
  }

  next();
});

const Movie = mongoose.model('Movie', MovieSchema);

export { OmdbMovie, Movie };