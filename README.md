[![Build Status][status]](https://travis-ci.org/Moveo/minimize)

[status]: https://travis-ci.org/Moveo/minimize.png?branch=master

# HTML minifier

Minimize is a HTML minifier based on the node-htmlparser. This depedency will
ensure output is solid and correct. Currently, HTML minifier is only usuable
server side. Client side minification will be added in a future release.

## Features


Upcoming in release 2.0 
 
- minification of inline javascript by [square](https://github.com/observing/square)
- client side minification support
- increased configurability (quote switcher, element replacement)

## Usage

To get the minified content make sure to provide a callback. Optional an options
object can be provided. All options are listed below and `false` per default.

```
var minimize = require('minimize')
  , options = {
        empty: true // DO NOT remove empty attributes 
      , cdata: true // DO NOT strip CDATA from scripts
      , comments: true // DO NOT remove comments
      , spare: true // DO NOT remove redundant attributes
    };

minimize(content, function (data) {
  console.log(data);
}, options);

```

## Options

**empty**

**cdata**

**comments**

**spare**

## Tests



## Benchmarks


## Credits
Minimize is influenced by the [HTML minifier](kangax) of kangax. This module 
parses the DOM as string as opposes to an object. However, retaining flow is more 
diffucult if the DOM is parsed sequentially. Minimize is not client-side ready.
Kangax minifier also provides some additional options like linting. Minimize
will retain strictly to the business of minifying. 

[HTMLparser](tauto) of Tautologistics is used to create an object representation 
of the DOM. 

[kangax]: https://github.com/kangax/html-minifier
[tauto]: https://github.com/tautologistics/node-htmlparser
