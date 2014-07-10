'use strict';

var express = require('express'),
	cors = require('cors'),
	http = require('http');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

// Setup Express
var app = express();
var http = http.Server(app);
var io = require('socket.io')(http);

app.use(cors());

require('./lib/config/express')(app);
require('./lib/routes')(app);

// Socket.io Communication
io.on('connection', function(socket) {
  console.log('a client connected');

	socket.on('tweet', function (data) {
	  // console.log("new tweet: " + JSON.stringify(data));

	  //use io.sockets.emit to send a message to all clients with the message category of 'broadcast' - 
	  //which is our key to know on the client-side that a new message is being broadcasted
	  io.sockets.emit('broadcast', data);
	});
});

// Start server
http.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
