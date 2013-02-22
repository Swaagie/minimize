var fs = require('fs')
  , content = fs.readFileSync('index.html', 'utf-8')
  , minimize = require('./lib/minimize');

minimize(content, function (data) {
  console.log(data);
});
