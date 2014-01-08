/************************************************
 * The endpoint for ajax calls
 ***********************************************/

var Endpoint = function(baseUrl) {
    this.baseUrl = baseUrl ? baseUrl : '';
};

Endpoint.prototype.post = function(path, data, callback) {
    if (!callback && _.isFunction(data)) {
        callback = data;
        data = null;
    } else if (!callback) callback = $.noop;
    data = data ? JSON.stringify(data) : '';
    this.send('post', path, data, callback);
};

Endpoint.prototype.get = function(path, data, callback) {
    if (!callback && _.isFunction(data)) {
        callback = data;
        data = null;
    } else if (!callback) callback = $.noop;
    this.send('get', path, data, callback);
};

Endpoint.prototype['delete'] = function(path, data, callback) {
    if (!callback && _.isFunction(data)) {
        callback = data;
        data = null;
    } else if (!callback) callback = $.noop;
    data = data ? JSON.stringify(data) : '';
    this.send('delete', path, data, callback);
};

Endpoint.prototype.send = function(method, path, data, callback) {
    var url = this.baseUrl + '/rest' + path;
    $.ajax({
        async: true,
        contentType: 'application/json',
        type: method,
        data: data,
        accept: 'application/json',
        dataType: 'json',
        url: url,
        cache: false,
        error: function(xhr, status, error) {
            callback({
                xhr: xhr,
                status: status,
                message: error
            });
        },
        success: function(data, status, xhr) {
            if (data.error) {
                callback(data.error);
            } else {
                callback(null, data.result);
            }
        }
    });
};