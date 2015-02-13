var path = require('path');

module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      dev: {
        options: {
          host: 'localhost',
          port: 8080,
          middleware: function(connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

            // Serve static files.
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        },
        proxies: [{
          context: '/server',
          host: 'localhost',
          port: 7000,
          changeOrigin: true,
          rewrite: {
            '^/server': ''
          }
        }, {
          context: '/executor',
          host: 'localhost',
          port: 7001,
          changeOrigin: true,
          rewrite: {
            '^/executor': ''
          }
        }]
      },
    },
    watch: {
      dev: {
        files: ['./**/*'],
        tasks: ['express:dev'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },
    bower: {
      install: {

      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-connect-proxy');

  grunt.registerTask('dev', ['configureProxies:dev', 'connect:dev', 'watch:dev']);
  grunt.registerTask('default', ['dev']);
};
