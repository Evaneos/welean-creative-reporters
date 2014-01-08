var _          = require('underscore'),
    url        = require('url'),
    utils      = require(__BACKEND + 'utils/'),
    cloudinary = require('cloudinary');


function _computeViewClasses(view) {
    // app/news-facebook/truc => app news-facebook truc
    var parts = view.split('/');
    return _.reduce(parts, function(memo, part) {
        return memo + ' ' + part;
    }, '') + ' ' + parts.join('-');
}


module.exports = function(nconf) {

    // cloudinary is configured only once
    cloudinary.config(nconf.get('cloudinary'));

    function _decorateVariables(variables, view, req) {
        if (!variables) variables = {};

        // default name for our app (maybe to be moved inside nconf)
        var appName = 'Creative Reporters';

        // req is an optional parameter
        // (emails are not processed within http reqs)
        if (req) {
            // add the current page url
            var parts = url.parse(req.url);
            variables.path = parts.path;

            // currently connected user variables
            if (req.user) {
                variables.__user = req.user;
            }
            if (req.organization) {
                variables.__organization = req.organization;
                if (req.season) variables.__season = req.season;
                if (req.nextSeason) variables.__nextSeason = req.nextSeason;
                appName = req.organization.space_name;
            }

            if (req.selectedSeason) {
                variables.__selectedSeason = {
                    previous: false,
                    season: false,
                    next: false
                };
                if (req.selectedSeason.season)      variables.__selectedSeason.season = req.selectedSeason.season;
                if (req.selectedSeason.previous)    variables.__selectedSeason.previous = req.selectedSeason.previous;
                if (req.selectedSeason.next)        variables.__selectedSeason.next = req.selectedSeason.next;
            }

            variables.__js = '/dist/creative-reporters.min.js?v=' + nconf.get('version');
        }

        // add the jade view (email included)
        variables.view = view;
        variables.viewClasses = _computeViewClasses(view);
        if (req && req.user && req.user.role) {
            variables.viewClasses += ' kv-role-' + req.user.role;
        }
        variables.appName = appName;

        // cloudinary helper
        variables.cloudinary = cloudinary;

        // make sure the title is always defined
        if (!variables.title) variables.title = appName;
        // append appName whenever needed
        if (variables.title.indexOf(appName) == -1) variables.title += ' - ' + appName;

        // nconf used with views (? ugly ?)
        variables.nconf = nconf;

        return variables;
    }

    return {

        decorateVariables: _decorateVariables,

        middleware: function(req, res, next) {
            var _render = res.render;
            res.render = function(view, variables, callback) {
                // add some global variables
                variables = _decorateVariables(variables, view, req);
                variables.frontEndScripts = require('./frontend-scripts.js')(__ROOT, { vendor: '/', business: '/frontend/' });
                // add client variables
                variables.clientVariables = res.prepareClientVariables();
                // call the old render function with these enhanced vars
                _render.call(res, view, variables, callback);
            };
            next();
        }
    };
};