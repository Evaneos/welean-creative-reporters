var middlew = require(__BACKEND + 'utils/middleware.js'),
    models  = require(__BACKEND + 'models');

module.exports = function(nconf) {

    function mapbox(req, res, next) {
        res.render('mapbox', {test: 'test'});
    }

    /**
     * module exports
     */

    return {
        '/mapbox': mapbox
    };
};