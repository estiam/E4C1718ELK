const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MovieSchema = new Schema({
  title: { type: String, required: true },
  release_date: Date,
  imdb_rating: Number,
  runtime: Number,
  summary: String,
  actors : [String],
  seen : Boolean
});

module.exports = mongoose.model('Movie', MovieSchema);

