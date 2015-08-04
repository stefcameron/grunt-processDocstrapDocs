module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  //
  // Register Tasks
  //

  /**
   * Post-process generated JSDoc documentation based on docstrap templates.
   *
   * Some issues with the templates are:
   *
   * 1. There are may relative URLs in the generated documation CSS and HTML
   *  files, such as all CSS files starting with an
   *  `@import url('//fonts.googleapis.com/...')` import statement, which
   *  results in a relative path to the URL. That means when docs are loaded
   *  locally, the resulting absolute path uses a `file://` protocol, which
   *  means the fonts fail to load -- which, depending on the system, can take
   *  a really long time (to resolve an invalid URL) and be really annoying
   *  when navigating the documentation.
   *
   * 2. The templates use the `navbar-fixed-top` style to keep the top toolbar
   *  visible while scrolling vertically, but when clicking on an inline link
   *  (e.g. a method for the class being viewed), the page scrolls to the right
   *  location but the method's name and signature end-up hidden behind the
   *  fixed top navbar/toolbar.
   *
   * This task fixes (1) by converting all URLs to absolute paths, as configured,
   *  and (2) by removing the `navbar-fixed-top` style from the top navbar.
   *
   * __Note:__ For this task, each source is also a destination. Destinations
   *  are __ignored__ (i.e. modifiations will be made to each source directory
   *  specified).
   *
   * @see https://github.com/terryweiss/docstrap
   */
  grunt.registerMultiTask('processdocstrapdocs',
      'Post-process JSDoc-generated, ink-docstrap-themed, documentation',
      function() {

    var options = this.options({
      /**
       * _Option:_ Fix the relative protocols, fixing them all to use the
       *  value of the `protocol` option.
       *
       * Default: `true`
       *
       * @type {Boolean}
       */
      fixProtocol: true,

      /**
       * _Option:_ Protocol to use when fixing relative protocols.
       *
       * Default: `http`
       *
       * @type {String}
       */
      protocol: 'http',

      /**
       * _Option:_ Fix the top navbar issue by letting it scroll with content.
       *  `false` by default since this really should be handled by customizing
       *  your template...
       *
       * Default: `false`
       *
       * @type {Boolean}
       */
      fixTopNavbar: false
    });

    // NOTE: we're using `this.filesSrc` because the sources are also the
    //  destinations for this task
    // @see http://gruntjs.com/inside-tasks#this.filessrc
    this.filesSrc.forEach(function(srcPath) {
      var docsDir = path.resolve(srcPath);
      var stylesDir = path.resolve(docsDir, 'styles');

      grunt.log.debug('docs directory: %s', docsDir);
      if (!grunt.file.isDir(docsDir)) {
        // skip this source; allow continuing only if --force
        grunt.fail.warn('docs directory ' + docsDir + ' not found');
        return;
      }

      grunt.log.debug('styles directory: %s', stylesDir);
      if (!grunt.file.isDir(stylesDir)) {
        // skip this source; allow continuing only if --force
        grunt.fail.warn('styles directory ' + stylesDir + ' not found');
        return;
      }

      grunt.file.recurse(docsDir, function(filePath, rootDir, subDir, fileName) {
        var content;

        // `subDir` is empty when iterating files in the root directory
        if (subDir && !subDir.match(/^styles$/i)) {
          return; // skip (we only want files in the root or in ./styles)
        }

        content = grunt.file.read(filePath);

        if (!subDir) { // in the root directory
          // process HTML files
          if ((options.fixTopNavbar || options.fixProtocol) &&
              filePath.match(/\.html$/i)) {

            grunt.log.debug('processing html: %s', filePath);

            if (options.fixTopNavbar) {
              content = content.replace('navbar-fixed-top ', '');
            }

            if (options.fixProtocol) {
              content = content.replace('//html5shiv',
                  options.protocol + '://html5shiv');
            }
          }
        } else {
          // process CSS files
          if (options.fixProtocol && filePath.match(/\.css$/i)) {
            grunt.log.debug('processing css: %s', filePath);

            content = grunt.file.read(filePath);

            content = content.replace(/url\((['"])?\/\/fonts/g,
                'url($1' + options.protocol + '://fonts');

            // site.flatly.css: the 'fred' protocol?! (in some older JSDoc releases)
            content = content.replace('url("fred://',
                'url("' + options.protocol + '://');
          }
        }

        grunt.file.write(filePath, content);
      }); // grunt.file.recurse()
    }.bind(this)); // forEach(srcPath)
  }); // grunt.registerMultiTask()
};
