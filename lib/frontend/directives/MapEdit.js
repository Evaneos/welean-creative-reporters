/**
 * mapbox-angular adapted for webzine
 */

var module = webzine.getModule('webzine.directives', [ 'mapbox' ]);

module.directive('mapEdit', ['$timeout', function($timeout) {

    return {
        restrict: 'E',
        scope: {
            center: '=?'
        },
        template: "<mapbox bounds='bounds' map='map' options='options'></mapbox>",
        link: function($scope, elem, params) {
            $scope.$watch('bounds', function() {
                if (typeof $scope.map !== 'undefined') {
                    var center = $scope.map.getCenter();
                    if (typeof center !== 'undefined') {
                        $scope.center  = center;
                    }
                }
                console.log($scope.center);
            });

            $scope.options = { 
                zoomControl: false,
                scrollWheelZoom: 'center',
                doubleClickZoom: 'center',
                offset: [0,0,0,500] 
            };
        }
    };
}]);