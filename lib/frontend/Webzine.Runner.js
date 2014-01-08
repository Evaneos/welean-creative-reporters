/*******************************************************************************
 * Main runner of this angular app
 ******************************************************************************/

var module = webzine.getModule('webzine', [
    'ngRoute',
    'webzine.controllers',
    'webzine.directives',
    'webzine.filters'
]);

/**
 * Initializer constructor
 */
var Runner = function() {
    // nada
};

// ----------------------------------------------------
// COMMON RUN o_O !
// ----------------------------------------------------

Runner.prototype.run = function($route, $rootScope, $http, stateService) {

    this.$route = $route;
    this.$rootScope = $rootScope;
    this.$http = $http;

    // all models can now http safely
    utils.Model.initializeAjax($http, {
        responseType: 'json',
        headers     : {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });

    // add some utilities to the Root Scope
    this._decorateScope($rootScope);

    // initialize cloudinary
    this._initializeCloudinary();
};


// ----------------------------------------------------
// INITIALIZE CLOUDINARY
// ----------------------------------------------------

Runner.prototype._initializeCloudinary = function() {
    var conf = webzine.frontData('nconf.cloudinary');
    $.cloudinary.config(conf);
};

// ----------------------------------------------------
// ROOT SCOPE UTILITIES
// ----------------------------------------------------

Runner.prototype._decorateScope = function($rootScope) {
    var self = this;
    // attach some global variables to the $rootScope
    if (webzine._frontData) {
        var scopeKeys = webzine.frontData('__scopeKeys');
        _(scopeKeys).each(function(key) {
            $rootScope[key] = webzine.frontData(key);
        });
    }

    // route helper
    $rootScope.path = function(controller, params) {
        for(var path in self.$route.routes) {
            var pathController = self.$route.routes[path].controller;
             // route was found
            if (pathController == controller) {
                var result = path;
                for (var param in params) {
                    result = result.replace(':' + param, params[param]);
                }
                return result;
            }
        }
        return undefined;
    };

    // In specific scenarios we need to tell angular
    // we changed something on the scope and that it
    // needs to recompute the view
    $rootScope.safeApply = function(scope, fn) {
        fn = fn || function() {};
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest'){
            scope.$eval(fn);
        } else {
            scope.$apply(fn);
        }
    };
};


// ----------------------------------------------------
// ATTACH TO MODULE
// ----------------------------------------------------
module.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'list',
        controller: 'ListController',
        controllerAs: 'list'
    });
    $routeProvider.when('/edit', {
        templateUrl: 'edit-template',
        controller: 'PostEditorController',
        controllerAs: 'editor'
    });
});

module.config(['$httpProvider', function($httpProvider) {

    var interceptor = ['$q', '$cacheFactory',

        function($q, $cacheFactory, cfpLoadingBar) {

            var reqsTotal = 0;
            var reqsCompleted = 0;

            function setComplete() {
                reqsCompleted = 0;
                reqsTotal = 0;
                setTimeout(function() {
                    if (reqsCompleted >= reqsTotal)
                        $('body').removeClass('http-loading');
                }, 500);
            }

            return {
                'request': function(config) {
                    if (reqsTotal === 0) {
                        $('body').addClass('http-loading');
                    }
                    reqsTotal++;
                    return config;
                },

                'response': function(response) {
                    reqsCompleted++;
                    if (reqsCompleted >= reqsTotal) {
                        setComplete();
                    }
                    return response;
                },

                'responseError': function(rejection) {
                    reqsCompleted++;
                    if (reqsCompleted >= reqsTotal) {
                        setComplete();
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ];
    $httpProvider.interceptors.push(interceptor);
}]);


module.run(['$route', '$rootScope', '$http', 'StateService', function($route, $rootScope, $http, stateService) {
    var runner = new Runner();
    runner.run($route, $rootScope, $http, stateService);
}]);