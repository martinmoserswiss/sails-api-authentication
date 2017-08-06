module.exports = function (req, res, next) {

  var token = req.headers['x-token'];

  // Verify if a valid token exists
  Token.isTokenValid({
    'token': token
  }, function isTokenValid (errIsTokenValid, isValid) {

    if (errIsTokenValid) {

      return res.serverError(errIsTokenValid);

    }

    if (!isValid) {

      return res.unauthorized({
        'message': 'Token is invalid'
      });

    }

    User
      .findOne(isValid.user.id)
      .exec(function findUserForView (errUser, user) {

        if (errUser) {

          return res.serverError(errUser);

        }

        return next();

      });

  });


};
