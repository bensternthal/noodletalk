var express = require('express');
var assert = require('should');
var sinon = require('sinon');
var messages = require('../routes/message');
var messageMaker = require('../lib/message-maker');
var app = express.createServer();
var io = require('socket.io').listen(app);
var content = require('../lib/web-remix');
var userList = new Array();

describe('message', function() {
  beforeEach(function() {
    var userList = {};
    var recentMessages = {};
    recentMessages.generic = [];
    recentMessages.media = [];
    messages(app, sinon.stub(), userList, recentMessages);
  });
  describe('.getMessage', function() {
    describe('has a request body', function() {
      describe('has a nickname change', function() {

        it('sets the session nickname', function() {
          var newNick = 'nick';
          var req = { 
            body: { 
              message: "/nick " + newNick
            },
            session: {
              nickname: newNick
            }
          };

          var subject = messageMaker.getMessage(req, io, userList);

        });
        it('sends a emote action');
        it('updates the userList');

        describe('old nickname is not Anonymous', function() {
          it('removes the old nickname from the userList');
        });

        describe('nickname is not on the userList', function() {
          it('adds the nickname to the userList');
        });

        describe('nickname is on the userList', function() {
          it('does not add nickname to userList');
        });

        describe('old nickname is Anonymous', function() {
          it('does not remove the nick from the userList');
        });

      });
      //describe('has no nickname change');

      describe('has no request session nickname', function() {
        it('sets the nickname to Anonymous');
      });
      describe('has a request session nickname', function() {
        it('does not set the nickname to Anonymous');
      });

      //describe('has a /me');

    });
    //describe('has no request body');
  });
});
