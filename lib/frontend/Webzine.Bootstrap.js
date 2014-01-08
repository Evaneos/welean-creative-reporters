/*******************************************************************************
 * creative-reporters angular bootstrap and module logic
 * + front data utilities
 * implemented as IIFE
 * > http://benalman.com/news/2010/11/immediately-invoked-function-expression/
 ******************************************************************************/

var webzine = (function() {

    var Webzine = function() {
        this.debugMode = false;
        this._modules = {};
        this._frontData = false;
    };

    // ----------------------------------------------------
    // PUBLIC METHODS
    // ----------------------------------------------------

    /**
     * A more convenient rewrite of angular.module(moduleName, dependencies);
     * @param  string moduleName
     * @param  array dependencies
     * @return object the module reference
     */
    Webzine.prototype.getModule = function(moduleName, dependencies) {
        dependencies = dependencies || [];
        if (!this._modules[moduleName]) {
            // create
            this._modules[moduleName] = angular.module(moduleName, dependencies);
        }
        return this._modules[moduleName];
    };

    /**
     * Bootstraps the runner
     */
    Webzine.prototype.bootstrap = function(moduleName) {
        this._preBootstrap();

        // o_O bootstrap!
        angular.bootstrap(document, [moduleName]);
        this.debug(moduleName + ' module correctly started.');

        this._postBootstrap();
    };

    /**
     * Reads data proxied thru the page from PHP's controller
     * @param  string key
     * @param  mixed defaultValue
     * @return mixed
     */
    Webzine.prototype.frontData = function(key, defaultValue) {
        return _(this._frontData).getDeepValue(key, defaultValue);
    };

    /**
     * A utility fn to translate message. Very equivalent to
     * Webzine' tools.php::t
     * Usage : webzine.t('%d travellers in %s', 344, 'Argentina')
     * @param  string message
     * @param... strings for sprintf replacement
     * @return string
     */
    Webzine.prototype.t = function(message) {
        var translated = message;
        if (typeof(this._i18n[message]) != 'undefined') {
            translated = this._i18n[message];
        } else {
            if (this.frontData('__debug')) {
                this.warn("The following translation key has not been found : ", message);
            }
        }

        var args = Array.prototype.slice.call(arguments);
        args.shift();
        args.unshift(translated);
        return sprintf.apply(this, args);
    };

    // ----------------------------------------------------
    // PRIVATE METHODS
    // ----------------------------------------------------

    Webzine.prototype._preBootstrap = function() {
        // for legacy support add BASE_URL and USER to global namespace
        window.BASE_URL = this.frontData('__baseUrl', false);
        window.USER = this.frontData('__user', false);
        this.debugMode = window.DEBUG = this.frontData('env', 'development') !== 'production';
        // initialize our i18n support
        this._initializeI18n();
    };

    Webzine.prototype._postBootstrap = function() {
        $('body').addClass('webzine-bootstrapped');
    };

    Webzine.prototype._initializeI18n = function(messages) {
        this._i18n = this.frontData('__i18n', {});
        delete this._frontData.__i18n;
        // attach a reference of that method to the window
        // as a convenient shortcut for the most used fn
        window.t = _(this.t).bind(this);
    };

    // ----------------------------------------------------
    // CONSOLE API
    // ----------------------------------------------------

    // decorate the debugger console api to provide
    // a global on/off switch and xbrowser support
    _(Webzine.prototype).extend({
        log: function() {
            if (!console || !this.debugMode) return;
            console.log.apply(console, arguments);
        },
        info: function() {
            if (!console || !this.debugMode) return;
            console.info.apply(console, arguments);
        },
        debug: function() {
            if (!console || !this.debugMode) return;
            console.debug.apply(console, arguments);
        },
        warn: function() {
            if (!console || !this.debugMode) return;
            console.warn.apply(console, arguments);
        },
        error: function() {
            if (!console || !this.debugMode) return;
            console.error.apply(console, arguments);
        },
        group: function() {
            if (!console || !console.group || !this.debugMode) return;
            console.group.apply(console, arguments);
        },
        groupEnd: function() {
            if (!console || !console.groupEnd || !this.debugMode) return;
            console.groupEnd();
        }
    });

    // create one instance of this bootstrap
    // and attach it to the global scope
    return new Webzine();

})();