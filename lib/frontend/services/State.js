/*******************************************************************************
 * Main service that will hold the application state
 ******************************************************************************/

var module = webzine.getModule('webzine.services', []);

var StateService = function($rootScope) {
    // DI storage
    this.$rootScope = $rootScope;

    var rawUser = webzine.frontData('__user', null);

    this.session = {};
    if (rawUser) {
        this.session.user = new models.User(rawUser);
    }
};

StateService.prototype.isLogged = function() {
    return this.session.user !== null;
};

StateService.prototype.getUser = function() {
    return this.session.user;
};

StateService.prototype.login = function(_user) {
    this.session.user = _user;
    this.$rootScope.$emit('stateService.sessionChanged');
};

StateService.prototype.logout = function() {
    this.session.user = null;
    this.$rootScope.$emit('stateService.sessionChanged');
};

module.service('StateService', [ '$rootScope', StateService ]);