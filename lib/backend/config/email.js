/**
 * CREATE THE EMAIL SERVER USED THROUGH OUT THE APP
 */

module.exports = function(nconf) {

    var emailjs     = require('emailjs'),
        async       = require('async'),
        jade        = require('jade'),
        juice       = require('juice'),
        fs          = require('fs'),
        emailServer = emailjs.server.connect(nconf.get('mail:smtp')),
        jadevars    = require(__BACKEND + 'utils/jade-variables.js')(nconf),
        _send       = emailServer.send;

    emailServer.send = function(emailType, options, callback) {
        var path = __dirname + '/../views/emails/' + emailType;
        var emailModule = require(path)(nconf);
        var _options = emailModule(options);
        var tasks = [];

        // from
        if (!_options.from) {
            _options.from = '{0} <{1}>'.format('Webzine', nconf.get('mail:noreply'));
        }

        // text
        if (!_options.text) {
            tasks.push(function(taskDone) {
                _options.textFile = _options.textFile || path + '/text.jade';
                if (fs.existsSync(_options.textFile)) {
                    _options.title = _options.subject;
                    jade.renderFile(_options.textFile, jadevars.decorateVariables(_options, emailType), function(err, str) {
                        if (err) console.warn(err);
                        _options.text = str;
                        taskDone();
                    });
                } else {
                    _options.text = false;
                    taskDone();
                }
            });
        }

        // html
        if (!_options.html) {
            tasks.push(function(taskDone) {
                _options.htmlFile = _options.htmlFile || path + '/html.jade';
                if (fs.existsSync(_options.htmlFile)) {
                    _options.title = _options.subject;
                    jade.renderFile(_options.htmlFile, jadevars.decorateVariables(_options, emailType), function(err, str) {
                        if (err) console.warn(err);
                        juice.juiceContent(str, {
                            url: 'file://' + __dirname + '/../public/'
                        }, function(err, str) {
                            if (err) console.warn(err);
                            _options.attachment = _options.attachment || [];
                            _options.attachment.push({
                                data: str,
                                alternative: true
                            });
                            taskDone();
                        });
                    });
                } else {
                    taskDone();
                }
            });
        } else {
            _options.attachment = _options.attachment || [];
            _options.attachment.push({
                data: _options.html,
                alternative: true
            });
        }

        async.parallel(tasks, function() {
            var config = {
                subject: _options.subject,
                to: _options.to,
                from: _options.from,
                attachment: _options.attachment
            };
            if (_options.text) {
                config.text = _options.text;
            }
            _send.call(emailServer, config, callback);
        });
    };

    return emailServer;
};