
var module = webzine.getModule('webzine.filters', []);

module.filter('cloudinaryUrl', function() {
    return function(imageId, options) {
        return $.cloudinary.url(imageId, options);
    };
});