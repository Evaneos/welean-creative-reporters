var middlew = require(__BACKEND + 'utils/middleware.js'),
    config  = require(__BACKEND + 'config/'),
    models  = require(__BACKEND + 'models');

var passport = config.passport;

var User = models.User;

module.exports = function(nconf) {

    var facebookConnect = passport.authenticate('facebook');
    var facebookResponse = function(req, res, next) {
        passport.authenticate('facebook', function(err, user, info){
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            //req.user = user ?
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.send('<script type="text/javascript">'
                +'if(window.opener){'
                +'    window.opener.onFacebookLogin(' + JSON.stringify(user) + ');'
                +'   window.close();'
                +'}else window.location="/";'
                +'</script>');
            });
        })(req, res, next);
    };

    function logout(req, res, next) {
        req.logout();
        if (req.xhr) {
            res.send('1');
        } else {
            res.redirect('/');
        }
    }
    function login(req, res, next) {
        res.redirect('/auth/facebook');
    }

    /**
     * module exports
     */

    return {
        '/auth': {
            '/facebook/callback': facebookResponse,
            '/facebook': facebookConnect,
            '/logout': [middlew.acl('registred'), logout],
            '/login': login
        }
    };
};