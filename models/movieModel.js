import mongoose from 'mongoose';

const MovieLocationSchema = mongoose.Schema(
  {
  id: Number,
  title: String,
  location: String,
  scene_description: String,
  movie_location_still: String,
  location_image: String,
  coordinates: [Number]
  }
);

const MovieLocation = mongoose.model('MovieLocation', MovieLocationSchema);

const omdb_DB = mongoose.connection
omdb_DB.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
    Movie_Location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MovieLocation'
    } 
});

// Define a pre-save middleware on the MovieSchema to automatically match and set the omdbMovie reference
omdbSchema.pre('save', async function (next) {
  const movieTitle = this.Title;

  // Find the corresponding OmdbMovie by title
  const movieLocation = await MovieLocation.findOne({ title: movieTitle });

  if (movieLocation) {
    // Set the omdbMovie reference in the Movie document
    this.Movie_Location = movieLocation._id;
  }

  next();
});

const OmdbMovie = mongoose.model('OmdbMovie', omdbSchema);

export { OmdbMovie, MovieLocation };
