'use strict';

var auth = require('../lib/authenticate');
var messageMaker = require('../lib/message-maker');
var noodleRedis = require('../lib/noodle-redis');

module.exports = function(client, nconf, app, io, isLoggedIn) {
  // Login
  app.post('/about/:channel/login', function(req, res) {
    auth.verify(req, nconf, function(error, email) {
      var channel = escape(req.params.channel);

      if(email) {
        req.session.email = email;
        req.session.userFont = Math.floor(Math.random() * 9);
        req.session.nickname = {};
        req.session.nickname[channel] = auth.generateRandomNick();

        auth.getUserHash(req, req.session.nickname[channel], channel, true, function(errHash, userHash) {
          req.session.emailHash = userHash.emailHash;
          messageMaker.getMessage(client, channel, req, io, 'joined', function(err, message) {
            try {
              noodleRedis.getUserlist(client, channel, function(errUser, userList) {
                try {
                  io.sockets.in(channel).emit('userlist', userList);
                  io.sockets.in(channel).emit('message', message);
                  res.json({ 'channel': channel });
                } catch(errUser) {
                  res.json({ 'status': 500, 'error': errUser });
                }
              });
            } catch(err) {
              res.json({ 'status': 500, 'error': err });
            }
          });
        });
      }
    });
  });

  // Logout
  app.get("/about/:channel/logout", isLoggedIn, function(req, res) {
    var channel = escape(req.params.channel);
    req.session.reset();
    res.redirect('/');
  });
};
