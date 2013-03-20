[![Build Status][status]](https://travis-ci.org/Moveo/minimize)

[status]: https://travis-ci.org/Moveo/minimize.png?branch=master

# HTML minifier

Minimize is a HTML minifier based on the node-htmlparser. This depedency will
ensure output is solid and correct. Minimize is focussed on HTML5 and will not
support older HTML drafts. It is not worth the effort and the web should move
forward. Currently, HTML minifier is only usuable server side. Client side 
minification will be added in a future release.

## Features

Upcoming in release 1.0 

- command line usage support
- increased configurability (element replacement, etc.)

Upcoming in release 2.0 
 
- minification of inline javascript by [square](https://github.com/observing/square)
- client side minification support

## Usage

To get the minified content make sure to provide a callback. Optional an options
object can be provided. All options are listed below and `false` per default.

```javascript
var Minimize = require('minimize')
    minimize = new Minimize({
        empty: true // DO NOT remove empty attributes 
      , cdata: true // DO NOT strip CDATA from scripts
      , comments: true // DO NOT remove comments
      , spare: true // DO NOT remove redundant attributes
      , quotes: true // DO NOT remove arbitrary quotes 
    });

minimize.parse(content, function (error, data) {
  console.log(data);
});
```

## Options

**Empty**

**CDATA**

CDATA is only required for HTML to parse as valid XML. For normal webpages this
is rarely the case, thus CDATA around javascript can be omitted. Below is an
example on how to do just that.

```javascript
var Minimize = require('minimize')
    minimize = new Minimize({ cdata: true });

minimize.parse(
    '<script type="text/javascript">\n//<![CDATA[\n...code...\n//]]>\n</script>'
  , function (error, data) {
      // data output: <script type=text/javascript>\n...code...\n</script>
    }
);
```

**Comments**

Comments inside HTML are usually beneficial while developing. Hiding your
comments in production is sane, safe and will reduce data transfer. If you
ensist on keeping them, for instance to show a nice easter egg, set the option
to true.

```javascript
var Minimize = require('minimize')
    minimize = new Minimize({ comments: true });

minimize.parse(
    '<!-- some HTML comment -->\n     <div class="slide nodejs">'
  , function (error, data) {
      // data output: <!-- some HTML comment --><div class="slide nodejs">
    }
);
```

**Spare**

**Qoutes**

Quotes are always added around attributes that have spaces or an equal sign in
their value. But if you require quotes around all attributes, simply pass
quotes:true, like below. 

```javascript
var Minimize = require('minimize')
    minimize = new Minimize({ quotes: true });

minimize.parse(
    '<p class="paragraph" id="title">\n    Some content\n  </p>'
  , function (error, data) {
      // data output: <p class="paragraph" id="title">Some content</p>
    }
);
```

## Tests

Tests can be easily run by using either of the following commands. Travis.ci is
used for continous integration. 

```bash
make test
make test-watch
npm test
```

## Benchmarks


## Credits
Minimize is influenced by the [HTML minifier](kangax) of kangax. This module 
parses the DOM as string as opposes to an object. However, retaining flow is more 
diffucult if the DOM is parsed sequentially. Minimize is not client-side ready.
Kangax minifier also provides some additional options like linting. Minimize
will retain strictly to the business of minifying. Minimize is already used in
production by [Nodejitsu][nodejitsu].

[node-htmlparser](fb55) of fb55 is used to create an object representation 
of the DOM. 

[kangax]: https://github.com/kangax/html-minifier/
[fb55]: https://github.com/fb55/node-htmlparser/
[nodejitsu]: http://www.nodejitsu.com/
