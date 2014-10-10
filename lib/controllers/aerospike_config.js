'use strict';

var aerospikeCluster  = '127.0.0.1';
var aerospikeClusterPort = 3000;

exports.aerospikeConfig = function()	{
	return	{
		hosts: [ { addr: aerospikeCluster, port: aerospikeClusterPort } ]
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
