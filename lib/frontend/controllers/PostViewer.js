
var module = webzine.getModule('webzine.controllers', [ 'webzine.services', 'webzine.directives' , 'webzine.filters' ]);

module.controller('PostViewerController', [ '$scope', '$rootScope', 'StateService', 'AuthService',

    function($scope, $rootScope, applicationState, authService) {
        var self = this;
        $scope.post = null;

        $scope.closeViewer = function() {
            $scope.post = null;
            return self.$modal.modal('hide');
        };

        $scope.starPost = function(post) {
            var user = applicationState.getUser();
            if (user) {
                post.star(user);
            } else {
                authService.login(function(user){
                    if (user) {
                        post.star(user);
                    }
                });
            }
        };

        $scope.$watch('viewerPost', function() {
            if (!$scope.viewerPost) {
                $scope.post = null;
                return self.$modal && self.$modal.modal('hide');
            }
            if ($scope.post == $scope.viewerPost) {
                $scope.post = null;
                self.$modal.modal('hide');
            } else {
                $scope.post = $scope.viewerPost;
                self.$modal.modal('show');
            }
        });
    }
]);