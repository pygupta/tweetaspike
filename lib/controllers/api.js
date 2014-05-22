'use strict';

var aerospike = require('aerospike');
var aerospikeConfig = {
    hosts: [ { addr: 'ec2-54-186-252-151.us-west-2.compute.amazonaws.com', port: 3000 } ]
};
var aerospikeDBParams = (function() {
  var dbName = 'test';
  var usersTable = 'users';
  var tweetsTable = 'tweets';
  var followingTable = 'following';
  var followersTable = 'followers';

  return {
    dbName: dbName,
    usersTable: usersTable,
    tweetsTable: tweetsTable,
    followingTable: followingTable,
    followersTable: followersTable
  };
})();

// Connect to the cluster.
var client = aerospike.client(aerospikeConfig);
client.connect(function (error) {
  if ( error.status === aerospike.status.AEROSPIKE_OK ) {
    // handle success
    console.log(client);
  }
  else {
    // handle failure
    console.error('error:', error);
  }
});

exports.checkUsername = function(req, res) {
  // console.log(req.body);
  console.log(aerospikeDBParams.dbName);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'username:'+params.username);
  // Read the record from the database
  client.get(key, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
          res.json({status : 'Ok', uid : rec.uid});
      }
      else {
          // An error occurred
          console.error('error:', err);
          res.json({status : 'Invalid Username'});
      }
  });
};

exports.checkPassword = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'uid:'+params.uid+':password');
  // Read the record from the database
  client.get(key, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK && rec.password === params.password) {
          // The record was successfully read.
          console.log(rec, meta);
          key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'uid:'+params.uid+':auth');
          client.get(key, function(err, rec, meta) {
              // Check for errors
              if ( err.code === aerospike.status.AEROSPIKE_OK ) {
                  // The record was successfully read.
                  console.log(rec, meta);
                  res.json({status : 'Ok', auth: rec.auth});
              }
              else {
                  // An error occurred
                  console.error('error:', err);
                  res.json({status : 'Invalid Password'});
              }
          });
      }
      else {
          // An error occurred
          console.error('error:', err);
          res.json({status : 'Invalid Password'});
      }
  });
};

exports.retrieveTweets = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:'+params.uid+':tweets');
  // console.log(params.uid);
  client.get(key, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          // console.log(rec, meta);
          res.json({status : 'Ok', tweets: rec.tweets});
      }
      else {
          // An error occurred
          console.error('retrieveTweets error:', err);
          res.json({status : err});
      }
  });
};

exports.updateTweets = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:'+params.uid+':tweets');
  // add record to the database
  // console.log(params.tweets);
  client.put(key, {tweets: params.tweets}, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
          res.json({status : 'Ok'});
      }
      else {
          // An error occurred
          console.error('updateTweets error:', err);
          res.json({status : err});
      }
  });
};

exports.createUser = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,params.uid);
  var userRecord = {uid: params.uid, username: params.username, password: params.password, auth: params.auth};
  var record = null;

  // console.log(userRecord);

  ///Add User record
  ///TODO: Refactor this code to batch requests
  client.put(key, userRecord, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully created.
          // console.log(rec, meta);

          ///Add Key-Value to look up uid based on username:X as key
          key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'username:'+params.username);
          record = {uid: params.uid};
          client.put(key, record, function(err, rec, meta) {
              // Check for errors
              if ( err.code === aerospike.status.AEROSPIKE_OK ) {

                ///Add Key-Value to look up uid based on uid:X:password as key
                key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'uid:'+params.uid+':password');
                record = {password: params.password};
                client.put(key, record, function(err, rec, meta) {
                    // Check for errors
                    if ( err.code === aerospike.status.AEROSPIKE_OK ) {
                      // The record was successfully created.

                      ///Add Key-Value to look up uid based on uid:X:auth as key
                      key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'uid:'+params.uid+':auth');
                      record = {auth: params.auth};
                      client.put(key, record, function(err, rec, meta) {
                          // Check for errors
                          if ( err.code === aerospike.status.AEROSPIKE_OK ) {
                            // The record was successfully created.

                            console.log(rec, meta);
                            res.json({status : 'Ok'});
                          }
                          else {
                            // An error occurred
                            console.error('createUser error: '+key, err);
                            res.json({status : err});
                          }
                      });

                    }
                    else {
                      // An error occurred
                      console.error('createUser error: '+key, err);
                      res.json({status : err});
                    }
                });

              }
              else {
                  // An error occurred
                  console.error('createUser error: '+key, err);
                  res.json({status : err});
              }
          });
      }
      else {
          // An error occurred
          console.error('createUser error: '+key, err);
          res.json({status : err});
      }
  });
};

exports.retrieveFollowing = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.followingTable,'uid:'+params.uid+':following');
  // console.log(params.uid);
  client.get(key, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
          res.json({status : 'Ok', following: rec.following});
      }
      else {
          // An error occurred
          console.error('retrieveFollowing error:', err);
          res.json({status : err});
      }
  });
};

exports.updateFollowing = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.followingTable,'uid:'+params.uid+':following');
  // add record to the database
  // console.log(params.following);
  client.put(key, {following: params.following}, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
          res.json({status : 'Ok'});
      }
      else {
          // An error occurred
          console.error('updateFollowing error:', err);
          res.json({status : err});
      }
  });
};


/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 1
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};