/**
 * mapbox-angular adapted for webzine
 */

var module = webzine.getModule('webzine.directives', [ 'mapbox' ]);

module.directive('mapPosts', ['$timeout', function($timeout) {

    var getGeojsonFromPost = function(post) {
        return {
            type: 'Feature',
            geometry: {
                type: "Point",
                //coordinates: [2.3508, 48.8567]
                coordinates: [post.position.lng, post.position.lat]
            },
            properties: {
                "id": post._id,
                "opacity": post.opacity,
                "order": post.viewId
            }
        };

    };

    var getPostFromFeature = function(feature, posts) {
        var post = _.find(posts, function(post) {
            if (feature !== null &&
                typeof feature !== 'undefined' &&
                typeof feature.feature !== 'undefined' &&
                typeof feature.feature.properties !== 'undefined' &&
                typeof feature.feature.properties.id !== 'undefined'
            ) {
                return post._id == feature.feature.properties.id;
            } else {
                return false;
            }
        });
        return post;
    };

    return {
        restrict: 'E',
        // replace: 'E',
        scope: {
            posts: '=',
            bounds: '=',
            postSelected: '=',
            onPostClicked: '&'
        },
        template: "<mapbox geojson='geojson' posts='posts' bounds='bounds' selected='selected' on-feature-clicked='onFeatureClicked(feature)'></mapbox>",
        link: function($scope, elem, params) {

            $scope.onFeatureClicked = function(feature) {
                var post = getPostFromFeature(feature, $scope.posts);
                $scope.onPostClicked({post: post});
            };

            $scope.$watch('posts', function(newValue, oldValue) {
                $scope.geojson = _($scope.posts).map(getGeojsonFromPost);
            });

            $scope.$watch('selected', function() {
                $scope.postSelected = getPostFromFeature($scope.selected, $scope.posts);
            });
        }
    };
}]);