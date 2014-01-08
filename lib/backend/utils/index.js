var _ = require('underscore'),
    mongoose = require('mongoose'),
    commonUtils = require(__COMMON + 'utils')(String, _);

// start from the common one
module.exports = commonUtils;

/**
 * Whitelist of ariables to be exposed
 * clientside via __pageProxy.nconf
 */
var NCONF_CLIENT_WHITELIST = {
    "http": {
        "host": true,
        "port": true
    },
    "cloudinary": {
        "cloud_name": true,
        "api_key": true
    },
    "mapbox": {
        "api_key": true
    }
};

function _nconfWhitelisted(currentPath, clientWhiteList, nconf) {
    var ret = {};
    _(clientWhiteList).each(function(value, key) {
        var _currentPath = key;
        if (currentPath) {
            _currentPath = currentPath + ':' + key;
        }
        if (value === true) {
            // expose value
            ret[key] = nconf.get(_currentPath);
        } else if (_(value).isObject()) {
            // recursion
            var rec = _nconfWhitelisted(_currentPath, value, nconf);
            if (rec) {
                ret[key] = rec;
            }
        }
    });
    return ret;
}

/**
 * Express middleware that lets you attach variables to
 * be passed to the client
 */
module.exports.pageProxy = function(nconf) {
    return function(req, res, next) {
        res.clientVariables = {};
        res.addClientVariable = function(key, value) {
            res.clientVariables[key] = value;
        };
        res.prepareClientVariables = function() {
            if (req.user) res.addClientVariable('__user', req.user);
            if (req.organization) res.addClientVariable('__organization', req.organization);
            if (req.season) res.addClientVariable('__season', req.season);
            res.addClientVariable('nconf', _nconfWhitelisted(false, NCONF_CLIENT_WHITELIST, nconf));
            res.addClientVariable('env', process.env.NODE_ENV);
            return res.clientVariables;
        };
        next();
    };
};

module.exports.randomToken = function(size) {
    require('crypto').randomBytes(size ? size : 10, function(ex, buf) {
        callback(buf.toString('hex'));
    });
};

module.exports.checkOptions = function(options, requiredKeys) {
    _(requiredKeys).each(function(key) {
        if (typeof(options[key]) == 'undefined') {
            throw new Exception('Key {0} is required'.format(key));
        }
    });
};

module.exports.toObjectIds = function(ids) {
    return _.map(ids, function(strId) {
        return mongoose.Types.ObjectId.fromString(strId);
    });
};

module.exports.toLower = function(str) {
    return _.isString(str) ? str.toLowerCase() : str;
};

module.exports.parsePaginationOptions = function(options, defaultSize) {
    return {
        skip: options.skip ? options.skip : 0,
        limit: options.limit ? options.limit : defaultSize
    };
};

module.exports.encodeStringForUrl = function(s) {
    if (!s) return false;
    // lowercase
    s = s.toLowerCase();
    // remove all new lines
    s = s.replace(/(\n)/g, '');
    // remove all trailing spaces
    s = s.replace(/^(\s)*/g, '');
    s = s.replace(/(\s)*$/g, '');
    // replace popular accents
    s = s.replace(/[àáâãäå]/g,"a");
    s = s.replace(/ç/g,"c");
    s = s.replace(/[èéêë]/g,"e");
    s = s.replace(/[ìíîï]/g,"i");
    s = s.replace(/ñ/g,"n");
    s = s.replace(/[òóôõö]/g,"o");
    s = s.replace(/[ùúûü]/g,"u");
    s = s.replace(/[ýÿ]/g,"y");
    // replace all other chars by '-'
    s = s.replace(/[^0-9a-z\-]/g, '-');
    // remove series of --
    s = s.replace(/(\-{2,})/g, '-');
    // and finally encore just to make sure
    return encodeURIComponent(s);
};