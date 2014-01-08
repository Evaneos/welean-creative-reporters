var _      = require('underscore'),
    models = require(__BACKEND + 'models'),
    config = require(__BACKEND + 'config'),
    stylus = require('stylus'),
    async  = require('async'),
    nib    = require('nib'),
    url    = require('url');


/**
 * Custom express middleware
 */

module.exports = {

    // 404 error
    error404: function(req, res, next) {
        res.status(404);

        logger.warn('404 - {0}'.format(req.url));

        // respond with html page
        if (req.accepts('html')) {
            res.render('404', {
                title: 'Erreur 404',
                url: req.url
            });
            return;
        }
        // respond with json
        if (req.accepts('json')) {
            res.send({
                title: 'Erreur 500',
                error: 'Not found'
            });
            return;
        }
        // default to plain-text. send()
        res.type('txt').send('Not found');
    },

    // Error-handling middleware
    error500: function(err, req, res, next) {
        // Not Authorized
        if (err && err.status == '401') return module.exports.error401(err, req, res, next);
        // Other errors
        if (err.status) res.statusCode = err.status;
        if (res.statusCode < 400) res.statusCode = 500;

        logger.error(err);
        console.error(err.message, err.stack);

        // html
        if (req.accepts('application/html')) {
            res.render('500', {
                title: 'Erreur 500',
                error: err
            });
        // json
        } else if (req.accepts('application/json')) {
            var error = { message: err.message, stack: err.stack };
            for (var prop in err) error[prop] = err[prop];
            var json = JSON.stringify({ error: error });
            res.send(json);
        // plain text
        } else {
            res.send(err.message + '\n' + err.stack);
        }
    },

    // Not Authorized
    error401: function(err, req, res, next) {
        //logger.error('Not Authorized: ' + req.url);
        res.statusCode = 401;

        // json
        if (req.headers.accept && !req.headers.accept.indexOf('application/json')) {
            var error = { message: 'Not authorized', code: 401 };
            var json = JSON.stringify({ error: error });
            res.send(json);
        // html
        } else if (req.accepts('application/html')) {
            res.redirect(err.redirectUrl);
        // plain text
        } else {
            res.send('Not authorized');
        }
    },

    acl: function(role) {
        return function(req, res, next) {
            if (!role) role = 'user';
            var passed = true;
            switch (role) {
                case 'visitor':
                    passed = !req.user;
                    break;
                case 'registred':
                    passed = req.user;
                    break;
                case 'creator':
                    passed = (req.user && (req.user.role == 'creator' || req.user.role == 'admin'));
                    break;
                case 'admin':
                    passed = (req.user && req.user.role == 'admin');
                    break;
            }
            if (passed) {
                return next();
            } else {
                var err = new Error('Not Authorized');
                err.status = 401;
                if (req.user) {
                    err.redirectUrl = '/app';
                } else {
                    req.session.redirectAfterLogin = req.url;
                    err.redirectUrl = '/auth/login';
                }
                throw err;
            }
        };
    },

    // A method to correctly format all rest exchanges
    restResponse: function(req, res, next) {
        res.sendRest = function(result) {
            res.send({
                result: result
            });
        };
        next();
    },

    stylus: stylus.middleware({
        src: __ROOT + 'public',
        compile: function(str, path) {
            return stylus(str)
                .use(nib())
                .set('include css', true)
                .set('filename', path)
                .set('compress', false);
        }
    })
};
