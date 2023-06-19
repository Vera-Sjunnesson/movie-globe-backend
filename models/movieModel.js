import mongoose from 'mongoose';

const MovieLocationSchema = mongoose.Schema(
  {
  id: Number,
  title: String,
  location: String,
  scene_description: String,
  movie_location_still: Buffer,
  location_image: String,
  coordinates: [Number],
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
  LikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  Comments: [{ userName: String, message: String }]
  }
);

const MovieLocation = mongoose.model('MovieLocation', MovieLocationSchema);

export { MovieLocation };
