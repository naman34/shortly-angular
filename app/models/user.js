
var mongoose = require('./mongo_config').mongoose;//require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

bcrypt = Promise.promisifyAll(bcrypt);

var userSchema = new Schema({
  username: { type: String, index: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (done) {
  this.updatedAt = Date.now();
  bcrypt.hashAsync(this.password, null, null).bind(this)
    .then(function(hash){
      this.password = hash;
      console.log(this);
    })
    .then(done);
}, { autoIndex: false });

userSchema.statics.findByUsernamePassword = function (obj, cb) {
  this.findOne({ username: obj.username }, function(err, user){
    if(!!err){
      cb(err);
    } else if(!user) {
      cb('no users found');
    } else {
      bcrypt.compareAsync(obj.password, user.password)
        .then(function(match){
          if(match){
            cb(null, {
              _id: user._id,
              username: (Array.isArray(user.username)) ? user.username[0] : user.username
            });
          } else {
            cb(null, null);
          }
        }).caught(cb);
    }
  });
};

exports.User = mongoose.model('Users', userSchema);

//setTimeout(function(){
  // User.create({username:'c', password: 'c'}, function(err, res){
  //   console.log("SAVING>>>", err, res);
  // });

  // exports.User.findByUsernamePassword({username:'c', password: 'c'}, function(err, res){
  //     console.log("FINDING>>>", err, res);
  //   })
  // console.log("something...");
  // }, 2000);

// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;