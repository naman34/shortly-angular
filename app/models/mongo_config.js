var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.connect('mongodb://127.0.0.1:27017/shortly', function(err, res){
  console.log(err, res);
});

exports.mongoose = mongoose;

//console.log(db);

// var db = mongoose.connect;

// db.on('error', console.error.bind(console, 'connection error:'));

// db.once('open', function() {
//   console.log("connected");
//   console.log(db);
// });

//exports.mongoose = mongoose;


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });


// var userSchema = mongoose.Schema({
//   username: String,
//   password: String
// });

// var linkSchema = mongoose.Schema({
//   url: String,
//   base_url: String,
//   code: String,
//   title: String,
//   visits: Number
// });

// var User = mongoose.model('Users', userSchema);
// var Link = mongoose.model('Links', linkSchema);

// // var user = new User({username: "a", password: "a"});
// // user.save(function(err, res){
// //   console.log("SAVING...", err, res);
// // });

// User.find({}, function(err, res){
//   console.log("FETCHING...", err, res);
// });