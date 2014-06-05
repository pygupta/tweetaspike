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

var start = 100001;
var end = 150000;
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
