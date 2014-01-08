var deepValue = {
    hasDeepValue: function(object, keys) {
        if (!object) return false;
        var keyArr = keys.split('.');
        var cur = object;
        var passed = true;
        _(keyArr).every(function(key) {
            if (!(key in cur)) {
                passed = false;
                return false;
            }
            cur = cur[key];
            return true;
        });
        return passed;
    },
    getDeepValue: function(object, keys, _default) {
        var keyArr = keys.split('.');
        var cur = object;
        var passed = true;
        _(keyArr).every(function(key) {
            if (!(key in cur)) {
                passed = false;
                return false;
            }
            cur = cur[key];
            return true;
        });
        return passed ? cur : _default;
    }
};

module.exports = function(_) {
    _.mixin(deepValue);
    return deepValue;
};