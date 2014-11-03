var async = require('async');
var args = require('yargs').argv;
var asConfig = require('./lib/controllers/aerospike_config');
var aerospikeConfig = asConfig.aerospikeConfig();
var aerospikeDBParams = asConfig.aerospikeDBParams();
var aerospike = require('aerospike');

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

function seedObjects()  {
  var start = 1;
  var end = 100000;

  for (var i = start; i <= end; i++) {
	  var record = {uid: "user"+i};
	  var key = aerospike.key(aerospikeDBParams.dbName,'test',"user"+i);
	  client.put(key, record, writeHandler);
  }
}

writeHandler = function (err,rec,meta) {
  if ( err.code === aerospike.status.AEROSPIKE_OK ) {
    // handle success
    // now initiate read
    var key = aerospike.key(aerospikeDBParams.dbName,'test',rec.key);
    client.get(key, readHandler);
  } else {
    // handle failure
     console.log('write error :'+err);
  }
}

readHandler = function (err,rec,meta) {
  if ( err.code === aerospike.status.AEROSPIKE_OK ) {
    // handle success
     // console.log(rec);
  } else {
    // handle failure
     console.log(err);
  }
}

seedObjects();
