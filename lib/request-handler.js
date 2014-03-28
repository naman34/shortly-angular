var util = require('../lib/utility');
var Promise = require('bluebird');

var User = require('../app/models/user').User;
var Link = require('../app/models/link').Link;

User = Promise.promisifyAll(User);
Link = Promise.promisifyAll(Link);
getUrlTitle = Promise.promisify(util.getUrlTitle);


var isProduction = process.env.NODE_ENV === 'production';

exports.renderIndex = function(req, res) {
  res.render('index', {
    production: isProduction
  });
};

exports.signupUserForm = function(req, res) {
  res.render('signup', {
    production: isProduction
  });
};

exports.loginUserForm = function(req, res) {
  res.render('login', {
    production: isProduction
  });
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.findAsync()
  .then(function(links){
    res.send(200, links);
  }).caught(function(err){
    console.log(err);
    res.status(503).send("Internal server error");
  });
};

exports.saveLink = function(req, res) {
  console.log("POSTED DATA IS: ", req.body);
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findAsync({url:uri})
    .then(function(response){
      if(response.length === 0){
        return getUrlTitle(uri)
      } else {
        res.send(200, response[0]);
        return null;
      }
    })
    .then(function(title){
      if(title === null) return null;
      return Link.createAsync({
            url: uri,
            base_url: req.headers.origin,
            title: title
          });
    })
    .then(function(newLink){
      if(newLink === null) return null;
      res.send(newLink);
    })
    .caught(function(err){
      console.log(err);
      res.status(503).send("Internal Server Error");
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findByUsernamePasswordAsync({username: username, password: password})
    .then(function(response){
      if(!response){
        res.redirect('/login');
      } else {
        util.createSession(req, res, response);
      }
    })
    .caught(function(err){
      console.log(err);
      res.redirect('/login');
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findAsync({ username: username })
    .then(function(response){
      if (!response[0]) {
        return User.createAsync({ username: username, password: password });
      } else {
        res.redirect('/signup');
        return null;
      }
    })
    .then(function(user){
      if(user === null) return null;
      util.createSession(req, res, user);
    })
    .caught(function(err){
      console.log(err);
      res.status(503).send("Internal server error");
    });
};

exports.navToLink = function(req, res) {

  Link.findAsync( { code: req.params[0] })
    .then(function(link){
      if (!link[0]){
        res.redirect('/');
      } else {
        res.redirect(link[0].url);
        return link[0];
      }
    })
    .then(function(link){
      if(!link) return;
      link.__v ++;
      link.save();
    })
    .caught(function(err){
      console.log(err);
      res.status(503).send("Internal Server Error");
    })
};