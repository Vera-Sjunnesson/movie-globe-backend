import mongoose from "mongoose";

const MovieSchema = mongoose.Schema({
  id: Number,
  title: String,
  key_scene: String,
  location_image: String,
  coordinates: [Number] // [longitude, latitude]
});

export const Movie = mongoose.model("Movie", MovieSchema);