
var mongoose = require('./mongo_config').mongoose;
var Promise = require('bluebird');
var crypto = require('crypto');

var linkSchema = mongoose.Schema({
  url: { type: String, index: true },
  base_url: String,
  code: { type: String, index: true },
  title: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{ autoIndex: false });

linkSchema.pre('save', function(done){
  this.updatedAt = Date.now();
  var shasum = crypto.createHash('sha1');
  var url = (Array.isArray(this.url))? this.url[0] : this.url;
  shasum.update(url);
  var code = shasum.digest('hex').slice(0,5);
  this.code = code;
  done();
});

exports.Link = mongoose.model('Links', linkSchema);


// var db = require('../config');
// var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;