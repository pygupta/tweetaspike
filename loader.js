var args = require('yargs').argv;;
//console.log(args);
var f = args.f;

if (f === undefined) { 
  console.log('\n::U::s::a::g::e:: Yo, here is how to use this thang!');
  console.log('node loader.js -f [putusers] || [puttweets] || [getusers] || [gettweets]\n');
  return;
}

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

// Connect to the cluster
var client = aerospike.client(aerospikeConfig);
client.connect(function (response) {
  if ( response.code === 0) {
    // handle success
    console.log("\nConnection to Aerospike cluster succeeded!\n");
  }
  else {
    // handle failure
    console.log("\nConnection to Aerospike cluster failed!\n");
    console.log(response);
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
  var randomTweets = ['For just $1 you get a half price download of half of the song. You will be able to listen to it just once.','People tell me my body looks like a melted candle','Come on movie! Make it start!','Byaaaayy','Please, please, win! Meow, meow, meow!','Put. A. Bird. On. It.','A weekend wasted is a weekend well spent','Would you like to super spike your meal?','We have a mean no-no-bring-bag up here on aisle two.','SEEK: See, Every, EVERY, Kind... of spot','We can order that for you. It will take a year to get there.','If you are pregnant, have a soda.','Hear that snap? Hear that clap?','Follow me and I may follow you','Which is the best cafe in Portland? Discuss...','Portland Coffee is for closers!','Lets get this party started!','How about them portland blazers!',"You got school'd, yo",'I love animals','I love my dog',"What's up Portland",'Which is the best cafe in Portland? Discuss...','I dont always tweet, but when I do it is on Tweetaspike'];
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

function getUsers()  {
  var start = Math.floor((Math.random() * 1) + 1);
  var end = Math.floor((Math.random() * 100000) + 1);
  var key;
  var uid;

  for (var i = start; i <= end; i++) {
    uid = Math.floor((Math.random() * 1000000) + 1);

    key = aerospike.key(aerospikeDBParams.dbName,aerospikeDBParams.usersTable,uid);

    console.log("user # " + i + " of " + end + " ===== reading usr" + uid);

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

if (f === 'putusers') { 
  seedUsers();
} else if (f === 'puttweets')  {
  seedUsersPosts();
} else if (f === 'getusers')  {
  getUsers();
} else if (f === 'gettweets')  {
  getUsersPosts();
} else {
  console.log('\n::U::s::a::g::e:: Yo, here is how to use this thang!');
  console.log('node loader.js -f [putusers] || [puttweets] || [getusers] || [gettweets]\n');
  return;
}
