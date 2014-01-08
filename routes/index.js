var _ = require('underscore');

module.exports = function(nconf) {

    var routes = {};
    _.deepExtend(routes, require('./home.js')(nconf));
    _.deepExtend(routes, require('./mapbox.js')(nconf));
    // _.deepExtend(routes, require('./css.js')(nconf));

    return routes;
};