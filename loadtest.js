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
	  var key = aerospike.key(aerospikeDBParams.dbName,'test',i);
	  client.put(key, record, cb);
  }
}

cb = function (err,rec,meta) {
  if ( err.code === aerospike.status.AEROSPIKE_OK ) {
    // The record was successfully created.
  } else {
     console.log('error [row: '+i+'] :'+err);
  }
}

seedObjects();
