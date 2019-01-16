const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

let MovieSchema = new Schema({
  title: { type: String, required: true, es_indexed: true },
  release_date: { type: Date, es_indexed: true },
  imdb_rating: { type: Number, es_indexed: true },
  runtime: { type: Number, es_indexed: true },
  summary: { type: String, es_indexed: true },
  actors: [String],
  seen: {type: Boolean, es_indexed: true},
});

MovieSchema.plugin(mongoosastic);
const Movie = mongoose.model('Movie', MovieSchema);

const stream = Movie.synchronize();
let count = 0;
stream.on('data', (err, doc) => count++);
stream.on('close', () => console.log(`Indexed ${count} documents`));
stream.on('error', err => console.log(err));


module.exports = Movie;

