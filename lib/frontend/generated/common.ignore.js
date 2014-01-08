require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"hmMGWc":[function(require,module,exports){
var moduleExports = {};

/************************************************************
 * String prototype alterations
 ***********************************************************/

moduleExports.enhanceString = function(String) {

    // 'My name is {0} {1}'.format('John', 'Doe')
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }
    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            if (typeof($) != 'undefined') {
                return $.trim(this);
            } else {
                return this;
            }
        };
    }
    String.prototype.ucFirst = function() {
        if (this.length) {
            var f = this.charAt(0).toUpperCase();
            return f + this.substr(1);
        }
        return '';
    };
    String.prototype.toHtmlBR = function() {
        if (this.length) {
            return this.replace(/\n/g, '<br/>');
        }
        return '';
    };
    String.prototype.truncate = function(ending, maxChars) {
        if (_.isUndefined(maxChars)) maxChars = 18;
        if (this.length > maxChars) {
            if (_.isUndefined(ending)) ending = "...";
            return this.substr(0, maxChars - 3) + ending;
        } else {
            return this;
        }
    };
    String.prototype.linkify = function() {
        return this.replace(
            /((ftp|http)[s]?:\/\/|www\.)[-a-zA-Z0-9@:%_\+.~#?&;\/\/=\(\)]+/gmi,
            function(url, $1, $2) {
                if (typeof $2 == "undefined") url = "http://" + url;
                return "<a href=\"" + url + "\">" + utils.prettifyUrl(url, 40) + "</a>";
            }
        );
    };
};


/************************************************************
 * Get xbrowser safe console API
 ***********************************************************/

moduleExports.getConsoleApi = function(debug) {
    return {
        log: function() {
            if (!console || !debug) return;
            console.log.apply(console, arguments);
        },
        info: function() {
            if (!console || !debug) return;
            console.info.apply(console, arguments);
        },
        debug: function() {
            if (!console || !debug) return;
            console.debug.apply(console, arguments);
        },
        warn: function() {
            if (!console || !debug) return;
            console.warn.apply(console, arguments);
        },
        error: function() {
            if (!console || !debug) return;
            console.error.apply(console, arguments);
        },
        group: function() {
            if (!console || !console.group || !debug) return;
            console.group.apply(console, arguments);
        },
        groupEnd: function() {
            if (!console || !console.groupEnd || !debug) return;
            console.groupEnd();
        }
    };
};


/************************************************************
 * Get xbrowser safe console API
 ***********************************************************/

moduleExports.prettifyUrl = function(url, maxChars) {
    if (!url) return url;
    url = url.replace(/(http:\/\/)|(https:\/\/)|(www.)|(:(\d{1,4}))|(\/$)/gi,'');
    if (maxChars) url = url.truncate('...', maxChars);
    return url;
};

moduleExports.encodeStringForUrl = function(s) {
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


/************************************************************
 * Facebook utils
 ***********************************************************/

moduleExports.getFacebookMediumSize = function(_url) {
    if (!_url) return;
    var l = _url.length;
    return _url.substring(0, l - 6) + '_a.jpg';
};

moduleExports.getFacebookBigSize = function(_url) {
    if (!_url) return;
    var l = _url.length;
    return _url.substring(0, l - 6) + '_n.jpg';
};

moduleExports.getFacebookPostUrl = function(rawPost) {
    return 'http://www.facebook.com/{0}/posts/{1}'.format(
        rawPost.social_account_id,
        rawPost.original_id.split('_')[1]
    );
};

moduleExports.getFacebookPageUrl = function(rawSocialAccount) {
    return 'http://www.facebook.com/{0}'.format( rawSocialAccount.id );
};

moduleExports.getFacebookPageThumb = function(rawSocialAccount) {
    return 'http://graph.facebook.com/{0}/picture'.format( rawSocialAccount.id );
};


/************************************************************
 * Initialize all
 ***********************************************************/

module.exports = function(String, _) {
    moduleExports.enhanceString(String);
    require('./underscore.deepExtend.js')(_);
    require('./underscore.deepValue.js')(_);
    return moduleExports;
};
},{"./underscore.deepExtend.js":3,"./underscore.deepValue.js":4}],"./lib/common/utils/index.js":[function(require,module,exports){
module.exports=require('hmMGWc');
},{}],3:[function(require,module,exports){
/**
 *   Based conceptually on the _.extend() function in underscore.js ( see http://documentcloud.github.com/underscore/#extend for more details )
 *   Copyright (C) 2012  Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
 *
 *   This program is free software: you can redistribute it and/or modify  it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License along with this program.  If not, see http://www.gnu.org/licenses/.
**/

var deepExtend = function(obj) {
  var parentRE = /#{\s*?_\s*?}/,
      slice = Array.prototype.slice,
      hasOwnProperty = Object.prototype.hasOwnProperty;

  _.each(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop])) {
          obj[prop] = source[prop];
        }
        else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
          if (_.isString(obj[prop])) {
            obj[prop] = source[prop].replace(parentRE, obj[prop]);
          }
        }
        else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
          if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
            throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
          } else {
            obj[prop] = _.reject(_.deepExtend(obj[prop], source[prop]), _.isNull);
          }
        }
        else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
          if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
            throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
          } else {
            obj[prop] = _.deepExtend(obj[prop], source[prop]);
          }
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};

/**
 * Dependency: underscore.js ( http://documentcloud.github.com/underscore/ )
 *
 * Mix it in with underscore.js:
 * _.mixin({deepExtend: deepExtend});
 *
 * Call it like this:
 * var myObj = _.deepExtend(grandparent, child, grandchild, greatgrandchild)
 *
 * Notes:
 * Keep it DRY.
 * This function is especially useful if you're working with JSON config documents. It allows you to create a default
 * config document with the most common settings, then override those settings for specific cases. It accepts any
 * number of objects as arguments, giving you fine-grained control over your config document hierarchy.
 *
 * Special Features and Considerations:
 * - parentRE allows you to concatenate strings. example:
 *   var obj = _.deepExtend({url: "www.example.com"}, {url: "http://#{_}/path/to/file.html"});
 *   console.log(obj.url);
 *   output: "http://www.example.com/path/to/file.html"
 *
 * - parentRE also acts as a placeholder, which can be useful when you need to change one value in an array, while
 *   leaving the others untouched. example:
 *   var arr = _.deepExtend([100,    {id: 1234}, true,  "foo",  [250, 500]],
 *                          ["#{_}", "#{_}",     false, "#{_}", "#{_}"]);
 *   console.log(arr);
 *   output: [100, {id: 1234}, false, "foo", [250, 500]]
 *
 * - The previous example can also be written like this:
 *   var arr = _.deepExtend([100,    {id:1234},   true,  "foo",  [250, 500]],
 *                          ["#{_}", {},          false, "#{_}", []]);
 *   console.log(arr);
 *   output: [100, {id: 1234}, false, "foo", [250, 500]]
 *
 * - And also like this:
 *   var arr = _.deepExtend([100,    {id:1234},   true,  "foo",  [250, 500]],
 *                          ["#{_}", {},          false]);
 *   console.log(arr);
 *   output: [100, {id: 1234}, false, "foo", [250, 500]]
 *
 * - Array order is important. example:
 *   var arr = _.deepExtend([1, 2, 3, 4], [1, 4, 3, 2]);
 *   console.log(arr);
 *   output: [1, 4, 3, 2]
 *
 * - You can remove an array element set in a parent object by setting the same index value to null in a child object.
 *   example:
 *   var obj = _.deepExtend({arr: [1, 2, 3, 4]}, {arr: ["#{_}", null]});
 *   console.log(obj.arr);
 *   output: [1, 3, 4]
 *
 **/

module.exports = function(_) {
    _.mixin({deepExtend: deepExtend});
    return deepExtend;
};
},{}],4:[function(require,module,exports){
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
},{}]},{},[4,3])
;