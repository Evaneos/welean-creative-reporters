var middlew = require(__BACKEND + 'utils/middleware.js');
var models  = require(__BACKEND + 'models');
var Post    = models.Post;
var PostStarred    = models.PostStarred;

module.exports = function(nconf) {

    function home(req, res, next) {
        return res.redirect('/app');
    }

    function app(req, res, next) {
        return res.render('app/index');
    }

    function list(req, res, next) {
        return res.render('app/list');
    }

    function editTemplate(req, res, next) {
        return res.render('app/edit');
    }

    /**
     * module exports
     */

    return {
        '/':                 home,
        '/app':              app,   
        '/list':             list,
        '/edit-template':    editTemplate
    };
};