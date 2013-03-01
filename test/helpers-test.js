'use strict';

var chai = require('chai')
  , expect = chai.expect
  , helpers = require('../lib/helpers')
  , html = require('./fixtures/html.json');

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
      expect(helpers).to.have.property('flow');
      expect(helpers.flow).to.be.a('regexp');
    });

    it('which has a regular expression named node', function () {
      expect(helpers).to.have.property('node');
      expect(helpers.node).to.be.a('regexp');
    });

    it('which has a regular expression named structural', function () {
      expect(helpers).to.have.property('structural');
      expect(helpers.structural).to.be.a('regexp');
    });

    it('which has an inline element reference', function () {
      expect(helpers).to.have.property('inline');
      expect(helpers.inline).to.be.a('array');
    });

    it('which has an singular element reference', function () {
      expect(helpers).to.have.property('singular');
      expect(helpers.singular).to.be.a('array');
    });
  });

  describe('function tag', function () {
    it('returns a string wrapped with < >', function () {
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
    it('returns true if <script>', function () {
    });

    it('returns false if element is not <script>', function () {
    });

    it('returns true if type === "text/javascript"', function () {
    });

    it('returns false if type !== "text/javascript"', function () {
    });
  });

  describe('function structure', function () {
    it('returns false if element is text', function () {
      var result = helpers.structure(html.text);

      expect(result).to.be.false;
      expect(result).to.be.a('boolean');
    });

    it('returns true if element is pre or textarea', function () {
      var result = helpers.structure(html.structure);

      expect(result).to.be.true;
      expect(result).to.be.a('boolean');
    });

    it('returns true if element is script of type text/javascript', function () {
      var result = helpers.structure(html.script);

      expect(result).to.be.true;
      expect(result).to.be.a('boolean');
    });

    it('returns false if element requires no structure', function () {
      var result = helpers.structure(html.element);

      expect(result).to.be.false;
      expect(result).to.be.a('boolean');
    });
  });

  describe('function text', function () {
    it('trims whitespace', function () {
    });

    it('replaces whitelines and spaces in non structural elements', function () {
    });

    it('retains structure if element requires structure', function () {
    });

    it('prepends space if the text is prepended with closing tag', function () {
    });
  });

  describe('inline element list', function () {
    it('is an array', function () {
      expect(helpers.inline).to.be.an('array');
    });

    it('has all required elements', function () {
      expect(helpers.inline.length).to.be.equal(31);
    });
  });

  describe('singular element list', function () {
    it('is an array', function () {
      expect(helpers.singular).to.be.an('array');
    });

    it('has all required elements', function () {
      expect(helpers.singular.length).to.be.equal(13);
    });
  });

  describe('regular expression structural', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.structural); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches pre or textarea', function () {
      expect(helpers.structural.test('pre')).to.be.true;
      expect(helpers.structural.test('textarea')).to.be.true;
    });
  });

  describe('regular expression node', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.node); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches tag or script', function () {
      expect(helpers.node.test('tag')).to.be.true;
      expect(helpers.node.test('script')).to.be.true;
    });
  });

  describe('regular expression flow', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.flow); }
      expect(regexp).to.not.throw(Error);
    });

    it('can detect if last part of string is closing tag', function () {
      var match = 'test string</b>'.match(helpers.flow);
      expect(match).to.be.an('array');
      expect(match[0]).to.be.equal('</b>');
    });

    it('can detect if last part of string is text', function () {
      var match = '</b>test'.match(helpers.flow);
      expect(match).to.be.an('array');
      expect(match[0]).to.be.equal('test');
    });
  });
});
