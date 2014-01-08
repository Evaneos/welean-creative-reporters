/**
 * CREATE A LOGGER
 */

module.exports = function(nconf) {

    var winston = require('winston');
    var transports = [],
        inProd = process.env.NODE_ENV == 'production',
        defaultLevel = inProd ? 'info' : 'debug',
        defaultTs = inProd;

    // the standard Console logger
    transports.push(new winston.transports.Console({
        //handleExceptions: true,
        timestamp: defaultTs,
        level: defaultLevel
    }));

    // finally build the winston logger
    // and make it a global var
    var logger = new winston.Logger({
        transports: transports,
        // make sure the error is not trapped by winston
        exitOnError: true,
        level: defaultLevel
    });

    // ensure npm level conventions are used here
    logger.setLevels(winston.config.npm.levels);

    // override winston.logger.log to put stack trace along errors included
    // 4 ways to attach some errors to the log:
    // - logger.warn('message', myError)
    // - logger.warn('message', [myError1, myError2])
    // - logger.warn('message', { error: myError })
    // - logger.warn('message', { errors: [myError1, myError2] })
    var _log = logger.log;
    logger.log = function() {
        var self     = this,
            errs     = [],
            args     = Array.prototype.slice.call(arguments),
            callback = typeof args[args.length - 1] === 'function' ? args.pop() : null,
            meta     = typeof args[args.length - 1] === 'object' ? args.pop() : {},
            isError  = function(a) { return a instanceof Error; };

        // logger.warn('message', myError)
        if (meta instanceof Error) {
            errs = [meta];
            meta = {};
        // logger.warn('message', { error: myError })
        } else if (meta.error instanceof Error) {
            errs = [meta.error];
            delete meta.error;
        // logger.warn('message', { errors: [myError1, myError2] })
        } else if (meta.errors && _(meta.errors).every(isError)) {
            errs = meta.errors;
            delete meta.errors;
        // logger.warn('message', [myError1, myError2])
        } else if (_(meta).isArray() && _(meta).every(isError)) {
            errs = meta;
            meta = {};
        }

        // finally attach the processed result
        if (errs && errs.length) {
            meta.errors = _(errs).map(function(err) {
                return _(err).pick('name', 'message', 'stack');
            });
            // if no message on the log, compute one from the first error message
            // supports: logger.warn(myError) or logger.warn([myError, myError2, etc...]) or ...
            if (args.length < 2) {
                args.push(meta.errors[0].message);
            }
        }

        args.push(meta);
        if (callback) args.push(callback);

        _log.apply(logger, args);
    };

    return logger;
};