var _ = require('underscore');

/**
 * Merges all models into one
 */

function mergeModule(exports, moduleName) {
    var _module = require(moduleName);
    _.extend(exports, _module);
}

module.exports = {};
mergeModule(module.exports, './user.js');
mergeModule(module.exports, './post.js');
mergeModule(module.exports, './post_starred.js');
mergeModule(module.exports, './invitation.js');