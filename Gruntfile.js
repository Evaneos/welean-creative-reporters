GLOBAL.__ROOT      = __dirname + '/';
GLOBAL.__BACKEND   = __dirname + '/lib/backend/';
GLOBAL.__FRONTEND  = __dirname + '/lib/frontend/';
GLOBAL.__COMMON    = __dirname + '/lib/common/';

var _               = require('underscore'),
    jadebrowser     = require('jade-browser'),
    frontendScripts = require(__BACKEND + '/utils/frontend-scripts')(__ROOT, { business: 'lib/frontend/', vendor: 'public/' } );


module.exports = function(grunt) {

    /**
     * CONFIGURATION
     */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        jshint: {
            options: {
                laxbreak: true
            },
            frontend: [ 'lib/common/**/*.js', 'lib/frontend/**/*.js', '!**/*.ignore.js' ],
            backend:  [ 'lib/common/**/*.js', 'lib/backend/**/*.js',  '!**/*.ignore.js' ]
        },

        mkdir: {
            all: {
                options: {
                    mode: 0700,
                    create: ['tmp']
                },
            },
        },

        jadebrowser: {
            dist: {
                dest: 'tmp/templates.js'
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                        // start with vendor scripts
                src:    frontendScripts.vendor
                        // then generated utils
                        .concat(['<%= jadebrowser.dist.dest %>', 'lib/frontend/generated/common.ignore.js'])
                        // last business code
                        .concat(frontendScripts.business),
                // dest: 'tmp/<%= pkg.name %>.js'
                dest: 'public/dist/<%= pkg.name %>.min.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'public/dist/<%= pkg.name %>.min.js'
            }
        },

        clean: {
            tmp: {
                src: ['tmp/*']
            }
        }
    });

    /**
     * IMPORTS
     */

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    /**
     * TASKS
     */

    // grunt.registerTask('dist', ['bump', 'jadebrowser', 'concat', 'uglify', 'clean']);
    grunt.registerTask('dist', ['mkdir', 'bump', 'jadebrowser', 'concat', 'clean']);

    grunt.registerTask('default', ['jshint', 'dist']);

    grunt.registerTask('jadebrowser', function() {
        // task init
        var done = this.async();
        grunt.config.requires('jadebrowser.dist.dest');
        // jade browser middleware
        var middleware = jadebrowser('/js/templates.js', '**/**-tpl.jade', {
            root: __dirname + '/views',
            maxAge: 0
        });
        // simulate req, res, next
        var path = grunt.config('jadebrowser.dist.dest'),
            req = { url: '/js/templates.js' },
            res = {
                writeHead: function(code, headers){},
                end: function(_str){
                    require('fs').writeFile(path, _str, function(err) {
                        if (err) {
                            grunt.log.error(err);
                            return done(false);
                        }
                        grunt.log.writeln('File "' + path + '" created.');
                        done();
                    });
                }
            },
            next = function(){};
        // do it!
        middleware(req, res, next);
    });

};
