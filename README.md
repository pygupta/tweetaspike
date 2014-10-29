Tweetaspike
===========

This application is built using -- Aerospike + Express + Angular + Node -- ASEAN (/a-shawn/) Stack.

The purpose of this sample application is to show that Aerospike data structures on top of a key-value store are an effective way to write applications with Aerospike as the only database. To demonstrate, this sample describes the design and implementation of a twitter-like application. 

The code is easy to follow and substantial enough to be a foundation in learning how to leverage Aerospike's technology and it can also be used as a "seed" application that you can expand.

### Application Features

  * Register | Login | Logout
  * Post &mdash; similar to tweets, only better since there's no character limit :)
  * Follow &mdash; follow other users
  * Unfollow &mdash; unfollow users you are following
  * Following &mdash; list of users you follow including their posts
  * Followers &mdash; list of users that follow you including their posts
  * Alerts &mdash; real-time alerts when users you are following add new posts

### Aerospike's Open Source Technologies Used

  * Aerospike Server
  * Aerospike Node.js Client

### Other Technologies Used
  * <a href='https://angularjs.org/' target='_blank'>AngularJS</a>
  * <a href='http://nodejs.org/' target='_blank'>Node.js</a>
  * <a href='http://expressjs.com/' target='_blank'>Express</a>
  * <a href='http://socket.io/' target='_blank'>Socket.io</a>
  * <a href='http://angular-ui.github.io/bootstrap/' target='_blank'>Angular UI</a>

### Get Up and Running

#### Prerequisite

- [Aerospike Server](http://www.aerospike.com/download/server/latest) – The server should be running and accessible from this app.

#### Usage

##### Build

To build the application and resolve dependencies, run command: **npm install**

##### Config

In [aerospike_config.js](https://github.com/aerospike/tweetaspike/blob/master/lib/controllers/aerospike_config.js), update **aerospikeCluster** and **aerospikeClusterPort** such that it points to your instance running Aerospike Server.

##### Run

To run the application, run command: **node server**

You should see message **Connection to Aerospike cluster succeeded!**

If you see *Connection to Aerospike cluster failed!*, please make sure your instance of Aerospike Server is running and available. Also confirm that **aerospikeCluster** and **aerospikeClusterPort** are set correctly as described above in the Config section.

If all is well, open web browser and point it to: [http://localhost:9000](http://localhost:9000)

### Additional Information

#### Data Models

##### Users

Key: uid
Bins:
*   uid - String
*   username - String
*   password - String
*   auth - String

Sample Record:
```js
{ ns: 'test', set: 'users', key: 'dash' } 
{ uid: 'dash',
  username: 'dash',
  password***: 'dash',
  auth: 'c18d1b9a-19fb-4b2b-b4d3-560c8af07ef6' }
```

Note: For simplicity password is stored in plain-text

##### Tweets

Key: "uid:<uid>:tweets"
Bin:
*   tweets - Array of Objects 

Sample Record:
```js
{ ns: 'test', set: 'tweets', key: 'uid:dash:tweets' } 
{ tweets:
   [ { tweet: 'Hello Portland!', ts: '2014-07-01T05:49:47.367Z' },
     { tweet: 'So hot today!', ts: '2014-07-01T05:39:38.136Z' },
     { tweet: 'Hi', ts: '2014-07-01T05:36:04.055Z' } ] }
```

