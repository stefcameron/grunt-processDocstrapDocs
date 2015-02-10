# grunt-processdocstrapdocs

[![Build Status](https://travis-ci.org/stefcameron/grunt-processDocstrapDocs.svg?branch=master)](https://travis-ci.org/stefcameron/grunt-processDocstrapDocs) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/grunt-processdocstrapdocs.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-processdocstrapdocs.png?downloads=true&stars=true)

Post-process generated JSDoc documentation based on docstrap templates.

## Issues Addressed

Some issues with the generated templates are:

1.  There are may relative URLs in the generated documation CSS and HTML
    files, such as all CSS files starting with an
    `@import url('//fonts.googleapis.com/...')` import statement, which
    results in a relative path to the URL. That means when docs are loaded
    locally, the resulting absolute path uses a `file://` protocol, which
    means the fonts fail to load -- which, depending on the system, can take
    a really long time (to resolve an invalid URL) and be really annoying
    when navigating the documentation.

    This is specifically logged as
    https://github.com/terryweiss/docstrap/issues/26

    This issue is fixed by converting all URLs to absolute paths, as configured.

2.  The templates use the `navbar-fixed-top` style to keep the top toolbar
    visible while scrolling vertically, but when clicking on an inline link
    (e.g. a method for the class being viewed), the page scrolls to the right
    location but the method's name and signature end-up hidden behind the
    fixed top navbar/toolbar.

    In reality, this issue could/should be handled by customizing your template,
    but in my case, that seemed like a lot of work when this quick post-processing
    would do the trick. This option is __disabled by default__.

    This issue is fixed by removing the `navbar-fixed-top` style from the top
    navbar.

__Note:__ For this task, each source is also a destination. Destinations are
__ignored__ (i.e. modifiations will be made to each source directory specified).

Big thanks to Terry Weiss (and contributors) for really nice JSDoc templates at
https://github.com/terryweiss/docstrap!

## Installation

`npm install grunt-processdocstrapdocs --save-dev`

## Configuration

    //// gruntfile.js:

    grunt.initConfig({
      jsdoc: {
        // your existing configuration
      },
      processdocstrapdocs: {
        options: {
          fixProtocol: true,
          protocol: 'http',
          fixTopNavbar: true
        },
        dist: {
          src: 'docs'
        }
      }
    });

    grunt.registerTrask('docs', ['jsdoc', 'processdocstrapdocs']);

    //// command line:

    $ grunt docs

Note that the `processdocstrapdocs` task must depend on the `jsdoc` task, that
your `jsdoc` task is expected to be configured to use one of the provided
[ink-docstrap templates](https://github.com/krampstudio/grunt-jsdoc#templates).

### Settings

#### src

Required: `src: {(String|Array.<String>)}`

The directory (`String`), or list of directories (`Array.<String>`), that contain
__generated__ JSDoc documentation based on an
[ink-docstrap template](https://github.com/krampstudio/grunt-jsdoc#templates).

### Options

#### fixProtocol

Optional: `fixProtocol: true`

Fix the relative protocols, changing them all to use the value of the
`protocol` option.

#### protocol

Optional: `protocol: 'http'`

Protocol to use when fixing relative protocols with `fixProtocol` enabled.

#### fixTopNavbar

Optional: `fixTopNavbar: false`

Fix the top navbar issue by letting it scroll with content.

This option is `false` by default since this really should be handled by
customizing your template...

## TODO

*   add some real tests
