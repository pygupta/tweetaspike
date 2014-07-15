var loadtest = require('loadtest');
var options = {
    url: 'http://localhost:9000/api/retrieveTweets?uid=dash',
    maxRequests: 100,
    method: 'post',
    body: 'dash'
};
loadtest.loadTest(options, function(error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(result);
    console.log('Tests run successfully');
});