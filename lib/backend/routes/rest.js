var middlew = require(__BACKEND + 'utils/middleware.js'),
    models  = require(__BACKEND + 'models');

var async = require('async');
var Post = models.Post;
var PostStarred = models.PostStarred;

module.exports = function(nconf) {

    function getPost(req, res, next) {
        var postId = req.param('id');
        Post.findById(postId, function(err, post) {
            if (err) return next(err);
            return res.sendRest(post);
        });
    }

    function getPosts(req, res, next) {
        Post.find({}, function(err, posts) {
            if (err) return next(err);
            return res.sendRest(posts);
        });
    }

    function searchPosts(req, res, next) {
        Post.search(req.query, req.user, function(err, posts) {
            if (err) {
                return next(err);
            }
            res.sendRest(posts);
        });
    }

    function starPost(req, res, next) {
        var postId = req.param('id'), userId = req.user._id;
        if (!postId) {
            return next(new Error('Bad request'));
        }
        async.parallel([
            function(onEnd){
                Post.findById(postId).count(function(err, count){
                    onEnd(count === 1 ? null : "The post doesn't exists");
                });
            },
            function(onEnd){
                PostStarred.existsByUserAndPost(userId, postId, function(err, exists) {
                    onEnd(err || (exists ? 'The user already starred this post' : null));
                });
            }], function(err){
                if (err) {
                    return next(err);
                }
                var ps = new PostStarred({ _userId: userId, _postId: postId });
                ps.save(function(err){
                    if (err) {
                        return next(err);
                    }
                    Post.update({ _id: postId }, {
                        $inc: { starredCount: 1 },
                        $push: { starredBy: userId }
                    }, function(err){
                        if (err) {
                            return next(err);
                        }
                        res.send('1');
                    });
                });
            });
    }

    function saveNewPost(req, res, next) {
        var userId = req.user._id;
        var elt = req.body;

        var resultCallback = function(content) {
            var p = new Post({
                name: elt.name,
                description: elt.description,
                type: elt.type,
                content: content,
                _userId: userId,
                tags: [], //TODO : parse description
                //[lng, lat]
                position: { lng: elt.location.lng, lat: elt.location.lat },
                date: moment(elt.date)
            });
            p.save(callback);
        };
        if (elt.type === 'image') {
            cloudinary.uploader.upload(elt.url, function(result){
                resultCallback({
                    imageId: result.public_id,
                    imageWidth: result.width,
                    imageHeight: result.height,
                    imageFormat: result.format
                });
            });
        } else {
            resultCallback({
                html: elt.content
            });
        }
    }

    /**
     * module exports
     */

    return {
        '/rest': {
            '/posts': {
                'get': getPosts,
                '/search': {
                    'get': searchPosts
                },
                '/save': {
                    'post':  [ middlew.acl('registred'), saveNewPost ]
                }
            },
            '/post/:id': {
                'get': getPost,
                '/star': [ middlew.acl('registred'), starPost ]
        }
        }
    };
};