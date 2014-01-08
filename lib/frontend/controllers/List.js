
var module = webzine.getModule('webzine.controllers', [ 'ngAnimate', 'webzine.services' ]);

module.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        });
    };
});

module.controller('ListController', [ '$timeout', '$scope', '$rootScope', 'StateService', 'AuthService', '$location', '$anchorScroll',

    function($timeout, $scope, $rootScope, applicationState, authService, $location, $anchorScroll) {

        $scope.isLogged = applicationState.isLogged.bind(applicationState);
        $scope.getUser = applicationState.getUser.bind(applicationState);

        currentViewer = null;

        init();

        function fetch() {
            models.Post.search($scope.mapBounds, { filter: $scope.selectedFilter }, fetchCallback);
        }

        function fetchCallback(err, posts) {
            if (err) {
                $scope.posts = [];
                return webzine.error(err);
            }
            $scope.posts = posts;
        }

        $scope.$on('$locationChangeStart', function(ev) {
            ev.preventDefault();
        });

        var timer = false;
        $scope.$watch('selectedPostOnMap', function(post) {
            if (typeof post != 'undefined') {
                timer = $timeout(function() {
                    $location.hash('id' + post._id);
                    $anchorScroll();
                }, 200);
            } else {
                $timeout.cancel(timer);
            }
            $scope.selectedPost = post;
        });

        $scope.selectFilter = function(filter) {
            $scope.selectedFilter = filter;
            fetch();
        };

        $scope.viewPost = function(index) {
            $scope.viewerPost = $scope.posts[index];
            $scope.viewerIndex = index;
        };

        $scope.selectPost = function(index) {
            $scope.selectedPost = $scope.posts[index];
            $scope.selectedIndex = index;
        };

        $scope.nextPost = function(post) {
            $scope.viewPost($scope.viewerIndex+1);
        };
        $scope.previousPost = function(post) {
            $scope.viewPost($scope.viewerIndex-1);
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

        function init() {
            fetch();
            $scope.selectedFilter = 'uploaded';
            $scope.$watch('mapBounds', function() {
                fetch();
            });
        }
    }
]);