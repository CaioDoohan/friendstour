var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var sass           = require('node-sass');
var sassMiddleware = require('node-sass-middleware');
var chalk          = require('chalk');
var routes         = require('./routes/index');
var routesADM      = require('./routes/users');
var moment         = require('moment');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

// adding the sass middleware
app.use(sassMiddleware({
    src: path.join(__dirname, 'scss/styleADM'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/stylesheets/styleADM'
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

module.exports = app;













app.listen(8080, function(){
  console.log(' ');  
  console.log(chalk.green("                 /         / "));
  console.log(chalk.green("              /' .,,,,  ./       "));   
  console.log(chalk.green("             /';'     ,/     "));
  console.log(chalk.green("            / /   ,,//,`'`       "));
  console.log(chalk.green("           ( ,, '_,  ,,,' ``    "));
  console.log(chalk.green("           |    /") + chalk.red("@") + chalk.green("  ,,, ;' `   "));
  console.log(chalk.green("          /    .   ,''/' `,``    "));
  console.log(chalk.green("         /   .     ./, `,, ` ;  "));
  console.log(chalk.green("      ,./  .   ,-,',` ,,/''\,'    "));
  console.log(chalk.green("     |   /; ./,,'`,,'' |   |      "));
  console.log(chalk.green("     |     /   ','    /    |   "));
  console.log(chalk.green("      \___/'   '     |     |   "));
  console.log(chalk.green("        `,,'  |      /     `\   "));
  console.log(chalk.green("             /      |        ~\   "));
  console.log(chalk.green("            '       ( "));
  console.log(chalk.green("           : "));
  console.log(chalk.green("          ; .         \--  "));
  console.log(chalk.green("        :   \         ;  Made by Nóis "));
  console.log(' ');
  
  
  console.log(chalk.yellow('Tamo juntão na porta ') + chalk.white.bgRed.bold('8080') );
});