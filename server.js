/**
 * Module dependencies.
 */

GLOBAL.__ROOT      = __dirname + '/';
GLOBAL.__BACKEND   = __dirname + '/lib/backend/';
GLOBAL.__FRONTEND  = __dirname + '/lib/frontend/';
GLOBAL.__COMMON    = __dirname + '/lib/common/';


// EXTERNAL
var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    jadebrowser = require('jade-browser'),
    _           = require('underscore'),
    RedisStore  = require('connect-redis')(express),
    flash       = require('connect-flash');

// APP DEPS
var utils                   = require(__BACKEND + 'utils/'),
    middlew                 = require(__BACKEND + 'utils/middleware.js'),
    config                  = require(__BACKEND + 'config/'),
    nconf                   = config.nconf,
    mongoose                = config.mongoose,
    passport                = config.passport,
    models                  = require(__BACKEND + 'models/'),
    jadevars                = require(__BACKEND + 'utils/jade-variables.js')(nconf);


/**
 * EXPRESS SERVER CONFIGURATION
 * Below we have the web app configuration
 * specifics only - all configuration that might
 * be useful for workers should go in /config/index.js
 */

var app = express();

app.configure(function() {
    app.disable('x-powered-by');
    app.enable('trust proxy');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        //store: new RedisStore(),
        secret: 'My super ksecret',
        cookie: {
            // make sure sessions are shared between all subdomains
            domain: '.' + nconf.get('http:host')
        }
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(middlew.restResponse);
    app.use(express.methodOverride());
    app.use(jadevars.middleware);
    app.use(utils.pageProxy(nconf));
    // to be moved on dev side when email css'll got grunted
    app.use(middlew.stylus);
    app.use(app.router);
    app.use(jadebrowser('/js/templates.js', '**/**-tpl.jade', {
        root: __dirname + '/views',
        maxAge: 0
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(middlew.error404);
    app.use(middlew.error500);
});

app.configure('development', function() {
    app.locals.pretty = true;
    app.enable('debug');
    app.use(express.errorHandler());
});


/**
 * Route definitions are dispatched in 3 modules:
 * - public: unloggued pages rendered by jade server-side (+ some POST requests)
 * - app: logged pages rendered by jade server-side (+ some POST requests)
 * - rest: API used for all ajax calls
 */

// enhance route definition by allowing maps
require(__BACKEND + 'utils/routes.js')(app);
// the actual routes
var routes = require(__BACKEND + 'routes')(nconf);
app.map(routes);


/**
 * Start the HTTP server
 */

http.createServer(app).listen(nconf.get('http:port'), function() {
    logger.info("Creative-reporters server listening on port " + nconf.get('http:port'));
});
