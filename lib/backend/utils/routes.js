var _ = require('underscore'),
    verbose = process.env.NODE_ENV != 'production';

module.exports = function(app) {

    var HTTP_VERBS = ['get', 'put', 'post', 'delete', 'options'];

    /**
     * Expose a app.map() function for better readability
     * of route definitions : https://github.com/BernadineComputing/express/blob/master/examples/route-map/index.js
     */
    app.map = function(a, route) {

        var _route,
            _key;

        route = route || '';

        for (var key in a) {

            var value = a[key];

            var type = 'object';
            if (_.isArray(value)) type = 'array';
            else if (_.isFunction(value)) type = 'function';

            switch (type) {

                // { '/path': { ... }}
                case 'object':
                    app.map(value, route + key);
                    break;

                // get: fn
                // OR '/path': fn - shortcut for get routes
                case 'function':
                    _route = route;
                    _key = key;
                    if (!_.contains(HTTP_VERBS, key)) {
                        _route = route + key;
                        _key = 'get';
                    }
                    if (verbose) logger.debug(_key, _route);
                    app[_key](_route, value);
                    break;

                // get: [middleware, fn]
                // OR '/path': [middleware, fn] - shortcut for get routes
                case 'array':
                    if (value.length < 2) {
                        logger.warn('Value invalid for route %s', route);
                        return;
                    }
                    _route = route;
                    _key = key;
                    if (!_.contains(HTTP_VERBS, key)) {
                        _route = route + key;
                        _key = 'get';
                    }
                    var middleware = value[0],
                        fn = value[1];
                    if (verbose) logger.debug(_key, _route);
                    value.unshift(_route);
                    app[_key].apply(app, value);
                    break;
            }
        }
    };
};