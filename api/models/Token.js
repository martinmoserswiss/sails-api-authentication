/**
 * Token.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    'token': {
      'type': 'text',
      'unique': true,
      'required': true
    },

    'expireDate': {
      'type': 'datetime',
      'required': true
    },

    // One-to-Many Parents
    'user': {
      'model': 'user',
      'required': true
    }
  },

  /**
   * @description Check if token is valid.
   *
   * @param {object} opts Token.
   * @param {function} cb Callback.
   *
   * @returns {void}
   */
  'isTokenValid': function isTokenValid (opts, cb) {

    Token
      .findOne({
        token: opts.token
      })
      .populate('user')
      .exec(function findToken (errFindToken, token) {

        var expireDate = '';
        var now = '';

        // If there are errors
        if (errFindToken) {
          return cb(errFindToken);
        }

        // If token is empty
        if (typeof token === 'undefined' || !token) {
          return cb(null, false);
        }

        expireDate = new Date(token.expireDate);
        now = new Date();

        // If expire date is later than now
        if (expireDate > now) {
          return cb(null, token);
        }

        // If token has expired
        return cb(null, false);

      });

  }

};
