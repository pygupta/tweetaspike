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
    console.error(error);
  }
});

function seedUsers()  {
  var start = 900000;
  var end = 1000000;
  var key;
  var uid;
  var userRecord;
  var record;
  var auth;
  var password;

  for (var i = start; i <= end; i++) {

    uid = 'usr'+i;
    auth = "auth_" + (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
    password = 'password'+i;
    userRecord = {uid: uid, username: uid, password: password, auth: auth};

    console.log(userRecord);

    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,uid);
    client.put(key, userRecord, function(err, rec, meta) {
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
        // The record was successfully created.
      } else {
         console.log('error 1 : '+err);
      }
    });

    ///Add Key-Value to look up uid based on uid:X:password as key
    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'uid:'+uid+':password');
    record = {password: password};
    client.put(key, record, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
        // The record was successfully created.
      }
      else {
        // An error occurred
        console.log('error 2 : '+err);
      }
    });

    ///Add Key-Value to look up uid based on username:X as key
    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'username:'+uid);
    record = {uid: uid};
    client.put(key, record, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
        // The record was successfully created.
      }
      else {
        // An error occurred
        console.log('error 3 : '+err);
      }
    });

    ///Add Key-Value to look up uid based on uid:X:auth as key
    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,'uid:'+uid+':auth');
    record = {auth: auth};
    client.put(key, record, function(err, rec, meta) {
      // Check for errors
      if ( err.code === aerospike.status.AEROSPIKE_OK ) {
        // The record was successfully created.
      }
      else {
        // An error occurred
        console.log('error 4 : '+err);
      }
    });

  }
}

function seedUsersPosts()  {
  var start = Math.floor((Math.random() * 1) + 1);
  var end = Math.floor((Math.random() * 100000) + 1);
  var key;
  var uid;
  var randomTweets = ['coffee is for closers!','lets get this party started!','nothing happened today :(',"you got school'd, yo",'yo, i got told','i love my dog',"what's up san fran","what's up nyc",'why you gotta hate','dont hate the player...','i dont always tweet, but when i do it is on tweetaspike'];
  var tweets;

  for (var i = start; i <= end; i++) {
    uid = Math.floor((Math.random() * 1000000) + 1);
    tweets = [];
    tweets.unshift({tweet: randomTweets[Math.floor((Math.random() * 10) + 1)], ts: randomDate(new Date(2014, 0, 1), new Date())});
    tweets.unshift({tweet: randomTweets[Math.floor((Math.random() * 10) + 1)], ts: randomDate(new Date(2014, 0, 1), new Date())});
    tweets.unshift({tweet: randomTweets[Math.floor((Math.random() * 10) + 1)], ts: randomDate(new Date(2014, 0, 1), new Date())});

    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:usr'+uid+':tweets');

    console.log("user # " + i + " of " + end + " ===== adding tweets for usr" + uid);
    // console.log(tweets);

    // add record to the database
    client.put(key, {tweets: tweets}, function(err, rec, meta) {
        // Check for errors
        // console.log(rec);
        if ( err.code === aerospike.status.AEROSPIKE_OK ) {
            // The record was successfully read.
        }
        else {
            // An error occurred
            console.error('seedUsersPosts error:', err);
        }
    });
  }
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toString();
}

function getBatchUsersPosts()  {
  var start = Math.floor((Math.random() * 1) + 1);
  var end = Math.floor((Math.random() * 100000) + 1);
  var keys = [];
  var tweets;

  for (var i = start; i <= end; i++) {
    keys.unshift(aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:usr'+i+':tweets'));
  }

  console.log(keys);

  // batch records record to the database
  client.batchGet(keys, function (err, results) {
    if ( err.code == aerospike.status.AEROSPIKE_OK ) {
      for (var i = 0; i < results.length; i++ ) {
        switch ( results[i].status ) {
          case aerospike.status.AEROSPIKE_OK:
            console.log("OK - ", results[i].record);
        }
      }
    }
    else {
      console.log("getBatchUsersPosts error: ", err);
    }
    client.close();
  });
}

function getUsersPosts()  {
  var start = Math.floor((Math.random() * 1) + 1);
  var end = Math.floor((Math.random() * 100000) + 1);
  var key;
  var uid;
  var tweets;

  for (var i = start; i <= end; i++) {
    uid = Math.floor((Math.random() * 1000000) + 1);

    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.tweetsTable,'uid:usr'+uid+':tweets');

    console.log("user # " + i + " of " + end + " ===== reading tweets for usr" + uid);

    client.get(key, function(err, rec, meta) {
        // Check for errors
        if ( err.code === aerospike.status.AEROSPIKE_OK ) {
          // The record was successfully read.
          // console.log(rec, meta);
        }
        else {
          // An error occurred
          // console.error('retrieveTweets error:', err);
        }
    });
  };
}


var args = require('yargs').argv;;
//console.log(args);
var f = args.f;

if (f === 'seedusers') { 
  seedUsers();
} else if (f === 'seedtweets')  {
  seedUsersPosts();
} else if (f === 'getusertweets')  {
  getUsersPosts();
} else if (f === 'getbatchusertweets')  {
  getBatchUsersPosts();
} else {
  console.log('Usage -fn [seedusers] || [seedtweets] || [getusertweets] || [getbatchusertweets]');
  return;
}

