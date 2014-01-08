var mapbox = angular.module("mapbox", []);

mapbox.directive('mapbox', ['$timeout', function($timeout) {

    return {
        restrict: 'E',
        scope: {
            geojson: '=',
            bounds: '=',
            selected: '=',
            onFeatureClicked: '&'
        },
        template: "<div id='{{id}}' class='map'></div>",
        link: function($scope, elem, params) {
            $scope.id = 'id' + (new Date()).getTime();

            $scope.setCenter = function() {
                alert('ok');
            }
            $timeout(function() {
                var map = L.mapbox.map($scope.id, webzine.frontData('nconf.mapbox.api_key'), { zoomControl: false })
                .setView([48.122, 5.669], 3);
                map.options.minZoom=3;
                map.setMaxBounds( [[-82,-270.0],[82,180.0]]);

                new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

                // Add custom popups to each using our custom feature properties
                map.markerLayer.on('layeradd', function(e) {
                    var marker = e.layer,
                        feature = marker.feature;
                    if (typeof feature.properties.opacity !== 'undefined') {
                        marker.setOpacity(feature.properties.opacity);
                    }
                    var html = ''
                    if (typeof feature.properties.order !== 'undefined') {
                        html = feature.properties.order;
                    }
                    marker.setIcon(L.divIcon({
                        className: 'count-icon',
                        html: html,
                        iconSize: new L.Point(30, 30),
                        iconAnchor: new L.Point(15,37)
                    }));
                    marker.options.riseOnHover = true;

                    marker.on('mouseover', function() {
                        console.log(marker.options.icon);
                        marker.setIcon(_.deepExtend(marker.options.icon, {options: {className: 'count-icon-selected'}}));
                        console.log(marker.options.icon);
                        $scope.selected = marker;
                        $scope.$apply();
                    });

                    marker.on('mouseout', function() {
                        marker.setIcon(_.deepExtend(marker.options.icon, {options: {className: 'count-icon'}}));
                        $scope.selected = null;
                        $scope.$apply();
                    });

                    marker.on('click', function() {
                        $scope.onFeatureClicked({feature: marker});
                    });
                });

                map.scrollWheelZoom.disable();
                map.on('moveend', function() {
                    $scope.bounds = map.getBounds();
                    $scope.$apply();
                })
                $scope.$watch('geojson', function() {
                    map.markerLayer.setGeoJSON($scope.geojson);
                    map.markerLayer.options.riseOnHover = true;
                });

            });
        }
    };
}]);