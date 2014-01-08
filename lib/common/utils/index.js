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