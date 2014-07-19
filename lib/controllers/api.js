'use strict';

var aerospike1C  = 'ec2-54-186-252-151.us-west-2.compute.amazonaws.com'
var aerospike2C = 'ec2-54-191-145-193.us-west-2.compute.amazonaws.com'
var aerospike3C = 'ec2-54-191-106-122.us-west-2.compute.amazonaws.com' 
var aerospike4 = 'ec2-54-191-1-92.us-west-2.compute.amazonaws.com' 
var aerospike5 = 'ec2-54-191-162-116.us-west-2.compute.amazonaws.com'

var aerospike = require('aerospike');
var aerospikeConfig = {
    hosts: [ { addr: aerospike4, port: 3000 } ]
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
  // console.log(req);
  var params = req.body;
  var uid = params.uid;
  if (uid === undefined || uid === null) {
    uid = req.query.uid;
  }
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:'+uid+':tweets');
  // console.log(params.uid);
  client.get(key, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
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

exports.createTweet = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:'+params.uid+':tweets');
  var tweets = [];

  //1) retrieve existing tweets for the user, if any
  client.get(key, function(err, rec, meta) {
      // Check for errors
      // console.log(rec);
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // user has tweets
          tweets = rec.tweets;
      }
      else {
          // user does not have any tweets                  
          // console.log(uid + ' does not have any tweets\n');                  
      }
      tweets.unshift({tweet: params.tweet, ts: new Date().toString()});
      // console.log(tweets);

      // add tweets to the database
      client.put(key, {tweets: tweets}, function(err, rec, meta) {
          // Check for errors
          // console.log(rec);
          if ( err.code === aerospike.status.AEROSPIKE_OK ) {
            // tweets added successfully
            // console.log(params.uid + ' just tweetaspiked : ' + params.tweet);
            res.json({status : 'Ok'});
          }
          else {
            // An error occurred
            // console.log(params.uid + ' could not tweetaspike : ' + params.tweet);
            res.json({status : err});
          }
      });
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
  var followers = [];
  var updatedFollowers = [];
  // add record to the database
  // console.log(params.following);
  client.put(key, {following: params.following}, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);

          if (params.toFollow !== undefined)  {

            //add current user as follower of 'toFollow' user
            //1. retrieve 'toFollow' user's followers
            key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.followersTable,'uid:'+params.toFollow+':followers');
            
            // console.log(params.toFollow);
            client.get(key, function(err, rec, meta) {
                // Check for errors
                if ( err.code === aerospike.status.AEROSPIKE_OK || err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
                    // The record was successfully read.
                    console.log(rec, meta);

                    //2. update followers list
                    if (rec.followers !== undefined)  {
                      followers = rec.followers;
                    }
                    followers.unshift(params.uid);

                    // add record to the database
                    // console.log(params.followers);
                    client.put(key, {followers: followers}, function(err, rec, meta) {
                        // Check for errors
                        if ( err.code === aerospike.status.AEROSPIKE_OK ) {
                            // The record was successfully read.
                            console.log(rec, meta);
                            // console.log("added you as follower of " + params.toFollow);
                            res.json({status : 'Ok', followers: followers});
                        }
                        else {
                            // An error occurred
                            console.error('updateFollowing 1 error:', err);
                            res.json({status : err});
                        }
                    });

                }
                else {
                    // An error occurred
                    console.error('updateFollowing 2 error:', err);
                    res.json({status : err});
                }
            });

          }

          if (params.toUnfollow !== undefined)  {

            //remove current user as follower of 'toUnfollow' user
            //1. retrieve 'toUnfollow' user's followers
            key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.followersTable,'uid:'+params.toUnfollow+':followers');

            // console.log('toUnfollow key = ' + 'uid:'+params.toUnfollow+':followers');
            client.get(key, function(err, rec, meta) {
                // Check for errors
                if ( err.code === aerospike.status.AEROSPIKE_OK || err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
                    // The record was successfully read.
                    // console.log(rec, meta);

                    //2. update followers list
                    if (rec.followers !== undefined)  {
                      followers = rec.followers;
                    }
                    for (var i = 0; i < followers.length; i++)  {
                      console.log(followers[i]);
                      if (followers[i] !== params.uid)  {
                        updatedFollowers.push(followers[i]);
                      }
                    }
                    // console.log(updatedFollowers);

                    // add record to the database
                    client.put(key, {followers: updatedFollowers}, function(err, rec, meta) {
                        // Check for errors
                        if ( err.code === aerospike.status.AEROSPIKE_OK ) {
                            // The record was successfully read.
                            console.log(rec, meta);
                            // console.log("added you as follower of " + params.toFollow);
                            res.json({status : 'Ok', followers: updatedFollowers});
                        }
                        else {
                            // An error occurred
                            console.error('updateFollowing 3 error:', err);
                            res.json({status : err});
                        }
                    });

                }
                else {
                    // An error occurred
                    console.error('updateFollowing 4 error:', err);
                    res.json({status : err});
                }
            });

          }

      }
      else {
          // An error occurred
          console.error('updateFollowing 0 error:', err);
          res.json({status : err});
      }
  });
};

exports.retrieveFollowers = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.followersTable,'uid:'+params.uid+':followers');
  // console.log(params.uid);
  client.get(key, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
          res.json({status : 'Ok', followers: rec.followers});
      }
      else {
          // An error occurred
          console.error('retrieveFollowers error:', err);
          res.json({status : err});
      }
  });
};

exports.updateFollowers = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.followersTable,'uid:'+params.uid+':followers');
  // add record to the database
  // console.log(params.followers);
  client.put(key, {followers: params.followers}, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          console.log(rec, meta);
          res.json({status : 'Ok'});
      }
      else {
          // An error occurred
          console.error('updateFollowers error:', err);
          res.json({status : err});
      }
  });
};

/**
 * JAVA APIs
 */

var java = require('java');
java.classpath.push('./lib/aerospike-client-3.0.25-jar-with-dependencies.jar');

var ASClient = java.import('com.aerospike.client.AerospikeClient');
var ASKey = java.import('com.aerospike.client.Key');
var ASBin = java.import('com.aerospike.client.Bin');
var ASRecord = java.import('com.aerospike.client.Record');
var ASPolicy = java.import('com.aerospike.client.policy.WritePolicy');
var HashMap = java.import('java.util.HashMap');

var jClient = new ASClient('ec2-54-186-252-151.us-west-2.compute.amazonaws.com',3000);

exports.jRetrieveTweets = function(req, res) {
  // console.log(req.body);
  var params = req.body;
  var key = new ASKey(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:'+params.uid+':tweets');
  var policy = new ASPolicy();
  policy.timeout = 50;

  ASRecord = jClient.getSync(policy, key);
  console.log('ASRecord');
  console.log(ASRecord);
  // console.log('ASRecord.toString()');
  // console.log(ASRecord.toString());
  // console.log('JSON.stringify(ASRecord)');
  // console.log(JSON.stringify(ASRecord));
  // console.log('JSON.stringify(ASRecord.bins)');
  // console.log(JSON.stringify(ASRecord.bins));
  // console.log('ASRecord.bins.toString()');
  // console.log(ASRecord.bins.toString());
  // console.log('ASRecord.bins.getValue(\'tweets\')');
  // console.log(ASRecord.bins.getValue('tweets'));

  HashMap = ASRecord.bins.entrySetSync();
  var j = HashMap.sizeSync();

  console.log(j);
  console.log(HashMap);
  console.log(HashMap.toString());

  // for(var i=0;i < j;i++) {
  //   console.log(HashMap.getValueSync);
  // }
 
  // for (var entry in Map) {
  //   console.log(entry.getValueSync());
  // };

  // jClient.get(null, key, function(rec) {
  //   console.log(rec);
  //   // Check for errors
  //   if ( rec !== null && rec !== undefined ) {
  //     // The record was successfully read.
  //     // console.log(rec, meta);
  //   }
  //   else {
  //     // An error occurred
  //     console.error('retrieveTweets error');
  //   }
  // });
  // jClient.close();
};
