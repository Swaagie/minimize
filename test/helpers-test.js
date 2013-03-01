'use strict';

var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , expect = chai.expect
  , Helpers = require('../lib/helpers')
  , helpers = new Helpers.constructor()
  , html = require('./fixtures/html.json');

chai.use(sinonChai);
chai.Assertion.includeStack = true;

describe('Helpers', function () {
  describe('is a module', function () {
    it('which has a function tag', function () {
      expect(helpers).to.have.property('tag');
      expect(helpers.tag).to.be.a('function');
    });

    it('which has a function close', function () {
      expect(helpers).to.have.property('close');
      expect(helpers.close).to.be.a('function');
    });

    it('which has a function text', function () {
      expect(helpers).to.have.property('text');
      expect(helpers.text).to.be.a('function');
    });

    it('which has a function isJS', function () {
      expect(helpers).to.have.property('isJS');
      expect(helpers.isJS).to.be.a('function');
    });

    it('which has a function structure', function () {
      expect(helpers).to.have.property('structure');
      expect(helpers.structure).to.be.a('function');
    });

    it('which has a function isInline', function () {
      expect(helpers).to.have.property('isInline');
      expect(helpers.isInline).to.be.a('function');
    });

    it('which has a regular expression named flow', function () {
      expect(Helpers).to.have.property('flow');
      expect(Helpers.flow).to.be.a('regexp');
    });

    it('which has a regular expression named node', function () {
      expect(Helpers).to.have.property('node');
      expect(Helpers.node).to.be.a('regexp');
    });

    it('which has a regular expression named structural', function () {
      expect(Helpers).to.have.property('structural');
      expect(Helpers.structural).to.be.a('regexp');
    });

    it('which has an inline element reference', function () {
      expect(Helpers).to.have.property('inline');
      expect(Helpers.inline).to.be.a('array');
    });

    it('which has an singular element reference', function () {
      expect(Helpers).to.have.property('singular');
      expect(Helpers.singular).to.be.a('array');
    });
  });

  describe('function tag', function () {
    it('returns a string wrapped with < >', function () {
      expect(helpers.tag(html.doctype)).to.be.equal('<!doctype html>');
    });

    it('is callable by element.type through proxy', function () {
      var elements = [
          html.doctype
        , html.singular
        , html.script
      ];

      expect(helpers.tag(html.inline)).to.be.true;
    });

    describe('prepends a space if the element', function () {
      it('is inline and prepended by text', function () {
      });

      it('is inline and prepended by closing tag', function () {
      });
    });
  });

  describe('function isInline', function () {
    it('returns true if inline element <strong>', function () {
      expect(helpers.isInline(html.inline)).to.be.true;
    });

    it('returns false if block element <html>', function () {
      expect(helpers.isInline(html.element)).to.be.false;
    });

    it('returns type Boolean', function () {
      expect(helpers.isInline(html.inline)).to.be.a('boolean');
    });
  });

  describe('function close', function () {
    it('only generates closing element for tags and scripts', function () {
      var result = helpers.close(html.doctype);

      expect(result).to.equal('');
      expect(result).to.be.a('string');
      expect(result.length).to.equal(0);
    });

    it('returns a string wrapped with </ >', function () {
      var result = helpers.close(html.element);

      expect(result).to.equal('</html>');
      expect(result).to.be.a('string');
    });

    it('returns an empty string if element.type is wrong', function () {
      var result = helpers.close(html.singular);

      expect(result).to.equal('');
      expect(result).to.be.a('string');
      expect(result.length).to.equal(0);
    });
  });

  describe('function isJS', function () {
    afterEach(function () {
      html.script.data = 'script type="text/javascript"';
    });

    it('returns false if element is not of type script', function () {
      expect(helpers.isJS(html.inline)).to.be.false;
    });

    it('returns true if type is script and attribute === null', function () {
      html.script.data = 'script';

      expect(helpers.isJS(html.script)).to.be.true;
    });

    it('returns true if type is script and attribute === "text/javascript"', function () {
      expect(helpers.isJS(html.script)).to.be.true;
    });

    it('returns false if type !== "text/javascript"', function () {
      html.script.data = 'script type="text/template"';
      expect(helpers.isJS(html.script)).to.be.false;
    });

    it('returns type Boolean', function () {
      expect(helpers.isJS(html.element)).to.be.a('boolean');
    });
  });

  describe('function structure', function () {
    it('returns false if element is text', function () {
      expect(helpers.structure(html.text)).to.be.false;
    });

    it('returns true if element is pre or textarea', function () {
      expect(helpers.structure(html.structure)).to.be.true;
    });

    it('returns true if element is script of type text/javascript', function () {
      var isJS = sinon.spy(helpers, 'isJS');

      expect(helpers.structure(html.script)).to.be.true;
      expect(isJS).to.be.calledOnce;

      isJS.restore();
    });

    it('returns false if element requires no structure', function () {
      expect(helpers.structure(html.element)).to.be.false;
    });

    it('returns type Boolean', function () {
      expect(helpers.structure(html.element)).to.be.a('boolean');
    });
  });

  describe('function text', function () {
    var text = 'some random text';

    afterEach(function () {
      html.text.data = text;
    });

    it('trims whitespace', function () {
      html.text.data += '   ';
      var result = helpers.text(html.text, html.inline, '');

      expect(result).to.be.equal(text);
    });

    it('replaces whitelines and spaces in non structural elements', function () {
      var result = helpers.text(html.multiline, html.inline, '');

      expect(result).to.be.equal(
        'some additional lines. some random text, and alot of spaces'
      );
    });

    it('retains structure if element requires structure', function () {
      var structure = sinon.spy(helpers, 'structure');

      expect(helpers.text(html.multiline, html.script, '')).to.be.equal(
        'some additional lines\n\n. some random text, and            alot of spaces'
      );
      expect(structure).to.be.calledOnce;
    });

    it('prepends space if current HTML ends with closing tag', function () {
      var result = helpers.text(html.text, html.inline, 'some HTML</strong>');

      expect(result).to.be.equal(' ' + text);
    });

    it('prepends space if current HTML ends with word boundart', function () {
      var result = helpers.text(html.text, html.inline, 'some HTML');

      expect(result).to.be.equal(' ' + text);
    });

    it('prepends no space if supplied text begins with interpunction');
  });

  describe('inline element list', function () {
    it('is an array', function () {
      expect(Helpers.inline).to.be.an('array');
    });

    it('has all required elements', function () {
      expect(Helpers.inline.length).to.be.equal(31);
    });
  });

  describe('singular element list', function () {
    it('is an array', function () {
      expect(Helpers.singular).to.be.an('array');
    });

    it('has all required elements', function () {
      expect(Helpers.singular.length).to.be.equal(13);
    });
  });

  describe('regular expression structural', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(Helpers.structural); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches pre or textarea', function () {
      expect(Helpers.structural.test('pre')).to.be.true;
      expect(Helpers.structural.test('textarea')).to.be.true;
    });
  });

  describe('regular expression node', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.node); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches tag or script', function () {
      expect(Helpers.node.test('tag')).to.be.true;
      expect(Helpers.node.test('script')).to.be.true;
    });
  });

  describe('regular expression flow', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(Helpers.flow); }
      expect(regexp).to.not.throw(Error);
    });

    it('can detect if last part of string is closing tag', function () {
      var match = 'test string</b>'.match(Helpers.flow);
      expect(match).to.be.an('array');
      expect(match[0]).to.be.equal('</b>');
    });

    it('can detect if last part of string is text', function () {
      var match = '</b>test'.match(Helpers.flow);
      expect(match).to.be.an('array');
      expect(match[0]).to.be.equal('test');
    });
  });
});
