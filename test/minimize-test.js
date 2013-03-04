'use strict';

var chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , html = require('./fixtures/html.json')
  , minimize = require('../lib/minimize');

chai.use(sinonChai);
chai.Assertion.includeStack = true;

describe('Minimize', function () {
  describe('is module', function () {
    it('which has minify', function () {
      expect(minimize).to.have.property('minimize');
      expect(minimize.minimize).to.be.a('function');
    });

    it('which has minifier', function () {
      expect(minimize).to.have.property('minifier');
      expect(minimize.minifier).to.be.a('function');
    });

    it('which has traverse', function () {
      expect(minimize).to.have.property('traverse');
      expect(minimize.traverse).to.be.a('function');
    });

    it('which has walk', function () {
      expect(minimize).to.have.property('walk');
      expect(minimize.walk).to.be.a('function');
    });

    it('which has htmlparser', function () {
      expect(minimize).to.have.property('htmlparser');
      expect(minimize.htmlparser).to.be.an('object');
    });
  });

  describe('function minifier', function () {
    // Options need restoring as static content is exposed by prototype.
    afterEach(function () {
      minimize.minimize([], function () { }, {
          empty: false
        , cdata: false
        , comments: false
        , spare: false
      });
    });

    it('throws an error if HTML parsing failed', function () {
      function err () {
        minimize.minifier('some error', []);
      }

      expect(err).throws('Minifier failed to parse DOM');
    });

    it('should start traversing the DOM as soon as HTML parser is ready', function () {
      var emit = sinon.spy(minimize.events, 'emit');

      minimize.minifier(null, []);
      expect(emit).to.be.calledOnce;

      var result = emit.getCall(0).args;
      expect(result).to.be.an('array');
      expect(result[0]).to.be.equal('parsed');
      expect(result[1]).to.be.equal('');

      emit.restore();
    });

    it('should handle inline flow properly', function (done) {
      minimize.minimize(html.interpunction, function (result) {
        expect(result).to.equal('<h3>Become a partner</h3><p>Interested in being part of the solution? <a href="/company/contact">Contact Nodejitsu to discuss</a>.</p>');
        done();
      });
    });

    it('should be configurable to retain comments', function (done) {
      minimize.minimize(html.comment, function (result) {
        expect(result).to.equal('<!-- some HTML comment --><div class=\"slide nodejs\"><h3>100% Node.js</h3><p>We are Node.js experts and the first hosting platform to build our full stack in node. We understand your node application better than anyone.</p></div>');
        done();
      }, { comments: true });
    });

    it('should leave structural elements (like scripts and code) intact', function (done) {
      minimize.minimize(html.code, function (result) {
        expect(result).to.equal("<code class=\"copy\"><span>var http = require('http');\nhttp.createServer(function (req, res) {\n    res.writeHead(200, {'Content-Type': 'text/plain'});\n    res.end('hello, i know nodejitsu');\n})listen(8080);</span> <a href=\"#\"><s class=\"ss-layers\" role=\"presentation\"></s> copy</a></code>");
        done();
      });
    });

    it('should be configurable to retain CDATA');
  });

  describe('function traverse', function () {
    it('should traverse the DOM object and return string', function () {
      var result = minimize.traverse([html.element], '');

      expect(result).to.be.a('string');
      expect(result).to.be.equal(
        '<html class=no-js><head></head><body class=container></body></html>'
      );
    });
  });

  describe('function walk', function () {
    it('should walk once if there are no children in the element', function () {
      var result = minimize.walk('', html.inline);

      expect(result).to.be.equal('<strong></strong>');
    });

    it('should traverse children and insert data', function () {
      var result = minimize.walk('', html.element);

      expect(result).to.be.equal(
        '<html class=no-js><head></head><body class=container></body></html>'
      );
    });
  });


  describe('function walk', function () {
    it('should throw an error if no callback is provided', function () {
      function err () {
        minimize.minimize(html.content, null);
      }

      expect(err).throws('No callback provided');
    });

    it('applies callback after DOM is parsed', function () {
      function fn () { }
      var once = sinon.spy(minimize.events, 'once');

      minimize.minimize(html.content, fn);
      expect(once).to.be.calledOnce;

      var result = once.getCall(0).args;
      expect(result).to.be.an('array');
      expect(result[0]).to.be.equal('parsed');
      expect(result[1]).to.be.equal(fn);
      once.restore();
    });

    it('calls htmlparser to process the DOM', function () {
      var parser = sinon.mock(minimize.htmlparser);
      parser.expects('parseComplete').once().withArgs(html.content);

      minimize.minimize(html.content, function () {});
      parser.restore();
    });
  });
});
