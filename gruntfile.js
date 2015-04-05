module.exports = function(grunt) {
  'use strict';

  // force line endings to LF on all operating systems (otherwise, defaults to
  //  CRLF on Windows)
  grunt.util.linefeed = '\n';

  // metadata/task configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // Tasks/Targets
    //

    // @task lint files
    jshint: {
      options: {
        jshintrc: true
      },

      // @target lint all solution-specific scripts (do NOT lint node_modules)
      all: {
        src: [
          'gruntfile.js',
          'tasks/**/*.js'
        ]
      }
    },

    // @task clean files
    clean: {
      // nothing to do yet...
    }
  });

  // load plugins that provides tasks from libraries we'll use
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // load custom task
  grunt.loadTasks('tasks');

  //
  // Register Tasks
  //

  grunt.registerTask('lint', 'lint all code', [
    'jshint:all'
  ]);

  grunt.registerTask('test', 'lint, then run all tests', [
    'lint'
  ]);

  // default task
  grunt.registerTask('default', ['test']);
};
