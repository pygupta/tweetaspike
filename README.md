Tweetaspike
===========

This **sample** application is built using ASEAN (/a-shawn/) Stack - Aerospike + Express + Angular + Node. 

Note: This application is intended to be used solely as a reference application.

* Aerospike's open sourced technologies being demonstrated in this app are:
  * Aerospike's In-Memory NoSQL Database
  * Aerospike's Node.js Client

**Motivations

  * The motivation behind creating this sample application is to showcase the ease of development using Aerospike’s technology and to help understand how the application could scale out without changing the application logic.
  * The motivation behind choosing this particular use case is that most developers can relate to a twitter-like application model. Therefore, allowing developers to focus on learning Aerospike’s technology rather than the use case

**Application Features

  * Register | Login | Logout
  * Post &mdash; similar to tweets only better since there's no character limit :)
  * Follow &mdash; follow other users
  * Unfollow &mdash; unfollow users you are following
  * Following &mdash; list of users you follow including their posts
  * Followers &mdash; list of users that follow you including their posts
  * Alerts &mdash; real-time alerts when users you are following add new posts

**Cloud Deployment (Amazon EC2)</strong>
  * In-Memory NoSQL Database Servers &mdash; EC2 instances running Ubuntu 12.04
  * Web Server &mdash; EC2 instance running Amazon Linux mounted with Node.js EBS application

**Other Technologies
  * <a href='http://socket.io/' target='_blank'>Socket.io</a>
  * <a href='http://bower.io/' target='_blank'>Bower</a>
  * <a href='http://yeoman.io/' target='_blank'>Yeoman</a>
  * <a href='http://gruntjs.com/' target='_blank'>Grunt</a>
  * <a href='http://angular-ui.github.io/bootstrap/' target='_blank'>Angular UI</a>

