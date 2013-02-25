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

To get the minified content make sure to provide a callback.

```
var minimize = require('minimize');

minimize(content, function (data) {
  console.log(data);
});

```

## Tests



## Benchmarks

