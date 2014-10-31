'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/checkUsername')
    .post(api.checkUsername);
  app.route('/api/checkPassword')
    .post(api.checkPassword);
  app.route('/api/updateTweets')
    .post(api.updateTweets);
  app.route('/api/createUser')
    .post(api.createUser);
  app.route('/api/retrieveTweets')
    .post(api.retrieveTweets);
  app.route('/api/retrieveFollowing')
    .post(api.retrieveFollowing);
  app.route('/api/updateFollowing')
    .post(api.updateFollowing);
  app.route('/api/retrieveFollowers')
    .post(api.retrieveFollowers);
  app.route('/api/updateFollowers')
    .post(api.updateFollowers);
  app.route('/api/createTweet')
    .post(api.createTweet);
  app.route('/api/retrieveStats')
    .post(api.retrieveStats);
  

  // Server Java API Routes
  app.route('/api/jRetrieveTweets')
    .post(api.jRetrieveTweets);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( index.index);
};