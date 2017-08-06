'use strict';

var uuid = require('node-uuid');

/**
 * @module Controller/AuthenticationController
 * @description Server-side logic for the Authentication API.
 *
 * @author Martin Moser <mail.martinmoser@gmail.com>
 * @copyright Martin Moser
 *
 * @path /api/controllers/AuthenticationController.js
 * @help See http://sailsjs.org/documentation/concepts/controllers
 */
module.exports = {

  'getToken': function getToken (req, res) {

    var authorization = req.headers.authorization || ''; // get the header
    var token = '';
    var auth = {};
    var parts = [];
    var email = '';
    var password = '';

    // If Authorization header is empty
    if (!authorization) {

      return res.forbidden({
        'message': 'The Authorization header must be filled.'
      });

    }

    token = authorization.split(/\s+/).pop(); // get the encoded auth token
    auth = new Buffer(token, 'base64').toString(); // convert from base64
    parts = auth.split(/:/); // split on colon
    email = parts[0];
    password = parts[1];

    if (typeof password === 'undefined' || !password) {

      return res.forbidden({
        'message': 'The Authorization header must be filled correctly.'
      });

    }

    User
      .findOne({
        'email': email
      })
      .exec(function findUserByEmail (errFindUserByEmail, user) {

        // If there's an error
        if (errFindUserByEmail) {

          return res.serverError(errFindUserByEmail);

        }

        // If there is no user with that email
        if (!user) {

          return res.notFound({
            'message': 'The user was not found.'
          });

        }

        if (password == user.password) {
          var expireDate = {};
          var tokenObj = {};

          expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);

          tokenObj = {
            'token': uuid.v4(),
            'expireDate': expireDate,
            'user': user.id
          };

          Token.create(tokenObj, function createToken (errCreateToken, newToken) {

            var responseBody = {};

            if (errCreateToken) {

              return res.serverError(errCreateToken);

            }

            delete user.password;

            responseBody = {
              'token': newToken.token,
              'expireDate': newToken.expireDate,
              'user': user
            };

            return res.ok(responseBody);

          });

        } else {
          return res.forbidden({
            'message': 'Email and password combination are invalid.'
          });
        }

      });
  }

};
