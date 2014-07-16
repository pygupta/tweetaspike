var loadtest = require('loadtest');
var args = require('yargs').argv;;

// console.log(args);
var maxRequests = args.r ? args.r : 100;
var uid = args.u ? args.u : 'dash';
var server = args.s ? args.s : 'http://localhost:9000/'

var options = {
    url: server+'api/retrieveTweets?uid='+uid,
    maxRequests: maxRequests,
    method: 'post'
};

console.log(options);

loadtest.loadTest(options, function(error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(result);
    console.log('Tests run successfully');
});