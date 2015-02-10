# grunt-processDocstrapDocs [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

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

## Options

### fixProtocol

`fixProtocol: true`

Fix the relative protocols, changing them all to use the value of the
`protocol` option.

### protocol

`protocol: 'http'`

Protocol to use when fixing relative protocols with `fixProtocol` enabled.

### fixTopNavbar

`fixTopNavbar: false`

Fix the top navbar issue by letting it scroll with content.

This option is `false` by default since this really should be handled by
customizing your template...

## TODO

*   publish to npm
*   add some real tests
