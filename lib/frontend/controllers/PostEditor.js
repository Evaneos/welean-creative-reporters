
var module = webzine.getModule('webzine.controllers', [ ]);

module.controller('PostEditorController', [ '$scope', '$rootScope', 'AuthService', function($scope, $rootScope, authService) {
    $scope.save = function(){
        new models.Post($scope.post).save();
    };

}]);
