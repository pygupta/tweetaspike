Tweetaspike
===========

```html
<div>
  <div class="modal-header">
      <h3 class="modal-title">About This App</h3>
  </div>
  <div class="modal-body">
    <p>
      This <i>sample</i> application is built using <strong>ASEAN (/a-shawn/) Stack &mdash; Aerospike + Express + Angular + Node</strong>. Note: This application is intended to be used solely as a reference application.
    </p>

    <p>Aerospike's open sourced technologies being demonstrated in this app are:
      <ul>
        <li>Aerospike's In-Memory NoSQL Database</li>
        <li>Aerospike's Node.js Client</li>
      </ul>
    </p>

    <p>To learn more about Aerospike's technology, please <strong><a href='http://www.aerospike.com/develop/'>click here</a></strong>. For questions/comments about this app or if you'd like to know how you can write your own app leveraging Aerospike's technology, feel free to drop me a line at <strong>dash @ aerospike dot com</strong>.</p>

    <p>
      <strong>Motivations</strong>
      <ul>
        <li>The motivation behind creating this sample application is to showcase the ease of development using Aerospike’s technology and to help understand how the application could scale out without changing the application logic.</li>
        <li>The motivation behind choosing this particular use case is that most developers can relate to a twitter-like application model. Therefore, allowing developers to focus on learning Aerospike’s technology rather than the use case</li>
      </ul>      
    </p>

    <p>
      <strong>Application Features</strong>
      <ul>
        <li>Register | Login | Logout</li>
        <li>Post &mdash; similar to tweets only better since there's no character limit :)</li>
        <li>Follow &mdash; follow other users</li>
        <li>Unfollow &mdash; unfollow users you are following</li>
        <li>Following &mdash; list of users you follow including their posts</li>
        <li>Followers &mdash; list of users that follow you including their posts</li>
        <li>Alerts &mdash; real-time alerts when users you are following add new posts</li>
      </ul>
    </p>

    <p>
      <strong>Cloud Deployment (Amazon EC2)</strong>
      <ul>
        <li>In-Memory NoSQL Database Servers &mdash; EC2 instances running Ubuntu 12.04</li>
        <li>Web Server &mdash; EC2 instance running Amazon Linux mounted with Node.js EBS application</li>
      </ul>
    </p>

    <p>
      <strong>Other Technologies</strong>
      <a href='http://socket.io/' target='_blank'>Socket.io</a> | <a href='http://bower.io/' target='_blank'>Bower</a> | <a href='http://yeoman.io/' target='_blank'>Yeoman</a> | <a href='http://gruntjs.com/' target='_blank'>Grunt</a> | <a href='http://angular-ui.github.io/bootstrap/' target='_blank'>Angular UI</a>
    </p>

  </div>
  <div class="modal-footer">
    <button class="btn btn-default btn-lg btn-block" ng-click="close()">Got It!</button>
  </div>
</div>
```
