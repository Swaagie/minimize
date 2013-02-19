var jsdom = require('jsdom')
  , parser = require('htmlparser')
  , sys = require('sys')
  , fs = require('fs');

var content = fs.readFileSync('index.html', 'utf-8');

var handler = new parser.DefaultHandler(function (error, dom) {
    if (error) return;

    console.log(dom[1].raw)
}, { ignoreWhitespace: true });

var htmlparser = new parser.Parser(handler);
htmlparser.parseComplete(content);
//sys.puts(sys.inspect(handler.dom, false, null));
