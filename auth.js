var passport = require("passport");
var passportJWT = require("passport-jwt");
var cfg = require("./config/config");

var users = [ { id : 1 , name : 'Caio' , password : '123Caio', email : 'caio@hotmail.com'}, { id : 2 , name : 'Caio' , password : '123Caio', email : 'caiopereira@hotmail.com'} ];

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
  var strategy = new Strategy(params, function(payload, done) {
    var user = users[payload.id] || null;
    if (user) {
      return done(null, {id: user.id});
    } else {
      return done(new Error("User not found"), null);
    }
  });
  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", cfg.jwtSession);
    }
  };
};