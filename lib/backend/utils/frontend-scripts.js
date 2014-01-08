var glob = require('glob'),
    _    = require('underscore');

var resolveBusiness = function(root, prefix) {
    var paths = glob.sync('/frontend/**/*.js', { root: root + '/lib/', nosort: true });

    // make the files relative to frontend
    var prefixLength = (root + '/lib/frontend/').length;
    paths = _(paths).map(function(absPath) {
        // remove file fs prefix + .js suffix
        return absPath.substring(prefixLength - 1, absPath.length - 3);
    });

    // ignore all .ignore.js
    paths = _(paths).reject(function(path) {
        return path.indexOf('.ignore.js') != -1;
    });

    // sort them so that Webzine goes before Webzine.*
    paths = paths.sort(function(path1, path2) {
        var isUtils1 = path1.indexOf('utils') === 0;
        var isUtils2 = path2.indexOf('utils') === 0;
        if (isUtils1 && !isUtils2) return -1;
        if (isUtils2 && !isUtils1) return 1;
        else return path1.localeCompare(path2);
    });

    // format: add requested prefix + readd .js suffix
    paths = _(paths).map(function(path) {
        // remove file fs prefix + .js suffix
        return prefix + path + '.js';
    });

    // o_O
    return paths;
};

var resolveVendor = function(root, prefix) {
    var paths = [
        // bower
        // ----------------
        'vendor/jquery/jquery.min.js',
        'vendor/underscore/underscore-min.js',
        'vendor/bootstrap/dist/js/bootstrap.min.js',
        'vendor/angular/angular.js',
        'vendor/angular-route/angular-route.js',
        'vendor/angular-animate/angular-animate.js',
        'vendor/moment/min/moment.min.js',
        'vendor/moment/lang/fr.js',
        // ol' school
        // ----------------
        'lib/jquery-ui-1.10.3.dnd.min.js',
        'lib/jquery.placeholder.js',
        'lib/jquery.timeago.js',
        'lib/jquery.scrollIntoView.min.js',
        'lib/jquery.autosize.min.js',
        'lib/bootstrap-colorpicker/js/colorpicker.js',
        'lib/bootstrap-datepicker/bootstrap-datepicker.js',
        'lib/bootstrap-datepicker/bootstrap-datepicker.fr.js',
        'lib/bootstrap-clickover.js',
        'lib/zeroclipboard/zeroclipboard.min.js',
        'lib/jquery.gritter/js/jquery.gritter.min.js',
        'lib/mapbox/mapbox.js',
        'lib/mapbox-angular.js',
        // cloudinary
        // ----------------
        'lib/jquery.ui.widget.js',
        'lib/jquery.iframe-transport.js',
        'lib/jquery.fileupload.js',
        'lib/jquery.cloudinary.js'
    ];
    return _(paths).map(function(path) {
        return prefix + path;
    });
};

module.exports = function(root, prefix) {

    return {
        vendor: resolveVendor(root, prefix.vendor),
        business: resolveBusiness(root, prefix.business)
    };

};