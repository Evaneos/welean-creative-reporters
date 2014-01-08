// utils is a browserified version of same utils used in node
var utils = require('./lib/common/utils/index.js')(String, _);

/**
 * Small utility function to have rich model objects
 */
var Model = function(rawData) {
    var self = this;
    _(rawData).each(function(value, key) {
        self[key] = value;
    });
    if (_(this.initialize).isFunction()) {
        this.initialize(rawData);
    }
};
Model.initializeAjax = function($http, defaultConfig) {
    var self = this;
    self._$http = $http;
    Model.$http = Model.prototype.$http = _(function(config) {
        // relative urls like "user/show/id" or "blabla"
        if (config.url.indexOf('/') !== 0 && config.url.indexOf('http') !== 0) {
            config.url = '/rest/' + config.url;
        }
        // make sure all configs are set
        config = _(defaultConfig).deepExtend(config);
        // then call
        return this._$http.call(self, config);
    }).bind(this);
};
Model.extend = function(extensions) {
    var ModelClass = function(rawData) {
        Model.call(this, rawData);
    };
    ModelClass.prototype = Model.prototype;
    ModelClass.prototype = _(ModelClass.prototype).extend(extensions);
    return ModelClass;
};

_(utils).extend({

    Model: Model,

    toClipboard: function(el, callback) {
        var clip = new ZeroClipboard(el, {
            moviePath: "/lib/zeroclipboard/zeroclipboard.swf"
        });
        clip.on('complete', function(client, args) {
            callback();
        });
    },

    watchOutsideClicks: function() {
        $('body').click(function(e) {
            $('.popover-link:not(.popover-link-modal)').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    },

    animateNumber: function(from, to, $el, cb) {
        var seconds = 2;
        var interval = 100;
        var increment = Math.ceil((to - from) / ((seconds * 1000) / 100));

        // an animation is already ongoing
        var myInterval = $el.data('animation-interval');
        if (myInterval) clearInterval(myInterval);

        myInterval = setInterval(function(){
            if((from + increment) < to){
                from += increment;
            } else {
                from = to;
                clearInterval(myInterval);
                $el.data('animation-interval', null);
            }
            cb(from);

        }, interval);
        $el.data('animation-interval', myInterval);
    }

});