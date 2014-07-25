'use strict';

var aerospikeCluster  = 'ec2-54-187-181-33.us-west-2.compute.amazonaws.com';

exports.aerospikeConfig = function()	{
	return	{
		hosts: [ { addr: aerospikeCluster, port: 3000 } ]
	};
};

exports.aerospikeDBParams = function()	{
  return {
    dbName: 'test',
    usersTable: 'users',
    tweetsTable: 'tweets',
    followingTable: 'following',
    followersTable: 'followers'
  };	
};
