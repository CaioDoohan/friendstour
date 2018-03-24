var express           = require('express');
var path              = require('path');
var favicon           = require('serve-favicon');
var logger            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var sass              = require('node-sass');
var sassMiddleware    = require('node-sass-middleware');
var chalk             = require('chalk');
var routes            = require('./routes/index');
var routesADM         = require('./routes/users');
var moment            = require('moment');
var validator         = require('express-validator'); 
var app               = express();
var configJwt         = require('./config/config');
var jwt               = require('jwt-simple');
var passport          = require('passport');
var User              = require('./models/loginDAO');
var Strategy          = require('passport-http-bearer').Strategy;

app.use(validator({

  errorFormatter : function( param, msg , value){
    var namespace  = param.split( '.' ),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
     formParam += '[' +  namespace.shift() + ']'; 
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }

}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', routesADM);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

console.log(chalk.blue('─────── Loading JwtBearerStrategy...'));

passport.use(new Strategy( function(token, cb) {
    try{
        var userX = jwt.decode(token, configJwt.jwtSecret);
        var UserModel = new User();
        UserModel.getByID(userX, function(recordnew){
          var record = {
                id: recordnew[0].user_id,
                username: recordnew[0].username,
                email: recordnew[0].email,
                admin : recordnew[0].admin
          };
          return (record == null ? cb(null, false) : cb(null, record));              
        });
        
        UserModel = null;        
    }
    catch(ex){
        console.log('Erro passport',ex);
        return cb(null, false);
    }    
  })
);

app.use(passport.initialize());

// adding the sass middleware
app.use(sassMiddleware({
    src: path.join(__dirname, 'scss/style'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/stylesheets/style'
}));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', function (err) {
  console.log(err);
}); 

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(chalk.blue('-|Umbler listening on port:',chalk.yellow(port)));
});

module.exports = app;


