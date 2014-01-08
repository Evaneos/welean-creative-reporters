var _ = require('underscore');

module.exports = function(nconf) {

    var routes = {};
    _.deepExtend(routes, require('./app.js')(nconf));
    _.deepExtend(routes, require('./rest.js')(nconf));
    _.deepExtend(routes, require('./auth.js')(nconf));

    return routes;
};