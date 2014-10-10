Tweetaspike
===========

This application is built using ASEAN (/a-shawn/) Stack - Aerospike + Express + Angular + Node.

The purpose of this sample application is to show that Aerospike data structures on top of a key-value store are an effective way to write applications with Aerospike as the only database. To demonstrate, this sample describes the design and implementation of a twitter-like application. The code is easy to follow and substantial enough to be a foundation in learning how to leverage Aerospike's technology and it can also be used as a "seed" application that you can expand.

## Application Features

  * Register | Login | Logout
  * Post &mdash; similar to tweets, only better since there's no character limit :)
  * Follow &mdash; follow other users
  * Unfollow &mdash; unfollow users you are following
  * Following &mdash; list of users you follow including their posts
  * Followers &mdash; list of users that follow you including their posts
  * Alerts &mdash; real-time alerts when users you are following add new posts

## Aerospike's Open Sourced Technologies Used

  * Aerospike Server
  * Aerospike Node.js Client

## Other Technologies Used
  * <a href='https://angularjs.org/' target='_blank'>AngularJS</a>
  * <a href='http://nodejs.org/' target='_blank'>Node.js</a>
  * <a href='http://expressjs.com/' target='_blank'>Express</a>
  * <a href='http://socket.io/' target='_blank'>Socket.io</a>
  * <a href='http://bower.io/' target='_blank'>Bower</a>
  * <a href='http://yeoman.io/' target='_blank'>Yeoman</a>
  * <a href='http://gruntjs.com/' target='_blank'>Grunt</a>
  * <a href='http://angular-ui.github.io/bootstrap/' target='_blank'>Angular UI</a>

# Next Step -- Get up and running

## Prerequisite

- [Aerospike Server](http://www.aerospike.com/download/server/latest) – The server should be running and accessible from this app.

## Usage

### Build

To build the application:

**npm install**

This will resolve all dependencies.

### Config

In [aerospike_config.js](https://github.com/aerospike/tweetaspike/blob/master/lib/controllers/aerospike_config.js), update **aerospikeCluster** and **aerospikeClusterPort** such that it points to your server running Aerospike Server.

### Run

To run the application:

**node server**

You should see message **Connection to Aerospike cluster succeeded!**. If not, please make sure your Aerospike Server is running and available. Also confirm that **aerospikeCluster** and **aerospikeClusterPort** are set correctly.

If all is well, open web browser to:

  [http://localhost:9000](http://localhost:9000)


To learn more about Aerospike's technology, please <strong><a href='http://www.aerospike.com/docs/'>click here</a></strong>. For questions or comments about this app or if you'd like to know how you can get started with your own app leveraging Aerospike's technology, feel free to drop me a line at <strong>dash @ aerospike dot com</strong>.



