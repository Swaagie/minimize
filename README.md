# HTML minifier

Minimize is a HTML minifier based on the node-htmlparser. This depedency will
ensure output is solid and correct.

## Features


## Usage

To get the minified content make sure to provide a callback.

```
var minimize = require('minimize');

minimize(content, function (data) {
  console.log(data);
});

```
