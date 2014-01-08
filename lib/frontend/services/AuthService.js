var module = webzine.getModule('webzine.services', []);

var AuthService = function(stateService, $http) {
    this.stateService = stateService;
    this.$http = $http;
};

AuthService.prototype.isLogged = function() {
    return this.stateService.isLogged();
};

AuthService.prototype.getUser = function() {
    return this.stateService.getUser();
};

AuthService.prototype.login = function(callback) {
    var thisAuthService = this;
    window.onFacebookLogin = function(user) {
        thisAuthService.stateService.login(user);
        if (callback) {
            callback(user);
        }
    };
    var popup = openPopupCentered(window.location.protocol + '//' + window.location.hostname+'/auth/facebook', 800, 500, 'facebook_auth');
};

AuthService.prototype.logout = function() {
    this.$http({ method: 'GET', url: '/auth/logout' });
    this.stateService.logout();
};

module.service('AuthService', [ 'StateService', '$http', AuthService ]);