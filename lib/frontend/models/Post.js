var models = models || {};

var DEFAULT_AVATAR = '/media/avatar_yellow.png';

models.Post = utils.Model.extend({

    initialize: function(rawData) {
        this.viewId = models.Post.getViewId(rawData._id);
        this.uploaded = moment(rawData.uploaded).toDate();
    },

    avatar: function(){
        var user = this.user;
        if(!user.accounts) return DEFAULT_AVATAR;
        var facebookAccount = _(user.accounts).findWhere({ provider: 'facebook' });
        return !facebookAccount ? DEFAULT_AVATAR : "http://graph.facebook.com/" + facebookAccount.facebookId + "/picture";
    },

    star: function(user, callback){
        if (!user) throw new Error();
        var thisPost = this;
        this.$http({
            url: 'post/{0}/star'.format(this._id),
            method: 'GET'
        }).success(function(data, status) {
            thisPost.starredCount++;
            thisPost.starredBy.push(user._id);
            return callback && callback(null, data ? data.result : null);
        }).error(function(data, status) {
            return callback && callback(status);
        });
    },

    isStarredBy: function(user) {
        return user && this.starredBy && _.contains(this.starredBy, user._id);
    },

    save: function(callback){
        var thisPost = this;
        this.$http({
            url: this._id ? 'post/{0}/save'.format(this._id) : 'posts/save'.format(this._id),
            method: 'POST',
            data: this
        }).success(function(data, status) {
            return callback && callback(null, data ? data.result : null);
        }).error(function(data, status) {
            return callback && callback(status);
        });

    }
});

/**
 * View ids - to have some user friendly indexes
 */

models.Post._currentViewId = 1;
models.Post._viewIdsCache = {};
models.Post.resetViewIds = function() {
    this._viewIdsCache = {};
};
models.Post.getViewId = function(mongoId) {
    if (!this._viewIdsCache[mongoId]) {
        this._viewIdsCache[mongoId] = this._currentViewId++;
    }
    return this._viewIdsCache[mongoId];
};

/**
 * Statics
 */

models.Post._parsePosts = function(postsAndUsers) {
    if (!postsAndUsers.posts) return [];
    var users = _(postsAndUsers.users).map(function(rawUser) {
        return new models.User(rawUser);
    });
    var posts = _(postsAndUsers.posts).map(function(rawPost) {
        var post = new models.Post(rawPost);
        var user = _(users).findWhere({ _id: post._userId });
        post.user = user;
        return post;
    });
    return posts;
};

models.Post.search = function(bounds, options, callback) {
    var _bounds = {};
    if (bounds) {
        _bounds.latBL = bounds._southWest.lat;
        _bounds.lngBL = bounds._southWest.lng;
        _bounds.latUR = bounds._northEast.lat;
        _bounds.lngUR = bounds._northEast.lng;
    }
    options = _(_bounds).extend(options);
    this.prototype.$http({
        url: 'posts/search',
        method: 'GET',
        params: options
    }).success(function(data, status) {
        return callback(null, models.Post._parsePosts(data.result));
    }).error(function(data, status) {
        return callback(status);
    });
};

models.Post.getPost = function(id, callback) {
    this.prototype.$http({
        url: 'post/{0}'.format(id),
        method: 'GET'
    }).success(function(data, status) {
        return callback(null, data ? data.result : null);
    }).error(function(data, status) {
        return callback(status);
    });
};

models.Post.getPosts = function(callback) {
    this.prototype.$http({
        url: 'posts',
        method: 'GET'
    }).success(function(data, status) {
        return callback(null, data ? data.result : null);
    }).error(function(data, status) {
        return callback(status);
    });
};