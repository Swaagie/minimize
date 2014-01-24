/*global beforeEach, afterEach*/
'use strict';

var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , expect = chai.expect
  , Helpers = require('../lib/helpers')
  , helpers = new Helpers()
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

    it('which has a function isStyle', function () {
      expect(helpers).to.have.property('isStyle');
      expect(helpers.isStyle).to.be.a('function');
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

    it('which has an array named node', function () {
      expect(helpers).to.have.property('node');
      expect(helpers.node).to.be.an('array');
    });

    it('which has a regular expression named retain', function () {
      expect(helpers).to.have.property('retain');
      expect(helpers.retain).to.be.a('regexp');
    });

    it('which has an named redundant', function () {
      expect(helpers).to.have.property('redundant');
      expect(helpers.redundant).to.be.an('array');
    });

    it('which has a regular expression named structural', function () {
      expect(helpers).to.have.property('structural');
      expect(helpers.structural).to.be.an('array');
    });

    it('which has a regular expression named cdata', function () {
      expect(helpers).to.have.property('cdata');
      expect(helpers.cdata).to.be.a('object');
      expect(helpers.cdata.start).to.be.a('regexp');
      expect(helpers.cdata.end).to.be.a('regexp');
    });

    it('which has a string with interpunction listed', function () {
      expect(helpers).to.have.property('interpunction');
      expect(helpers.interpunction).to.be.a('string');
      expect(helpers.interpunction).to.be.equal('.,!%;:?$');
    });

    it('which has a regexp named start which triggers on interpunction', function () {
      expect(helpers).to.have.property('start');
      expect(helpers.start).to.be.a('regexp');
    });

    it('which has a regexp named end which has dashes appended', function () {
      expect(helpers).to.have.property('end');
      expect(helpers.end).to.be.a('regexp');
    });

    it('which has an inline element reference', function () {
      expect(helpers).to.have.property('inline');
      expect(helpers.inline).to.be.an('array');
    });

    it('which has an singular element reference', function () {
      expect(helpers).to.have.property('singular');
      expect(helpers.singular).to.be.an('array');
    });

    it('which has a default config', function () {
      expect(helpers).to.have.property('config');
      expect(helpers.config).to.be.an('object');
    });
  });

  describe('function directive', function () {
    it('returns a string wrapped with < >', function () {
      expect(helpers.directive(html.doctype)).to.be.equal('<!doctype html>');
    });
  });

  describe('function attributes', function () {
    var quote;

    beforeEach(function () {
      quote = sinon.spy(helpers, 'quote');
    });

    afterEach(function () {
      quote.restore();
      html.block.attribs = null;
    });

    it('should convert the attribute object to string', function () {
      expect(helpers.attributes(html.singular)).to.be.equal(' type=text name=temp');
      expect(quote).to.be.calledTwice;
    });

    it('should return early if element has no attributes', function () {
      expect(helpers.attributes(html.block)).to.be.equal('');
      expect(quote.callCount).to.be.equal(0);
    });

    it('should remove attributes that are empty, not boolean and have no semantic value', function () {
      html.block.attribs = { disabled: 'disabled' };
      expect(helpers.attributes(html.block)).to.be.equal(' disabled');
      html.block.attribs = { autofocus: '' };
      expect(helpers.attributes(html.block)).to.be.equal(' autofocus');
      html.block.attribs = { loop: 'random' };
      expect(helpers.attributes(html.block)).to.be.equal(' loop');
      html.block.attribs = { muted: 'true' };
      expect(helpers.attributes(html.block)).to.be.equal(' muted');
      expect(quote.callCount).to.be.equal(0);
    });

    it('should retain empty schemantic and data attributes', function () {
      html.block.attribs = { 'data-type': '' };
      expect(helpers.attributes(html.block)).to.be.equal(' data-type=""');
      html.block.attribs = { 'itemscope': '' };
      expect(helpers.attributes(html.block)).to.be.equal(' itemscope');
      expect(quote.callCount).to.be.equal(1);
    });
  });

  describe('function quote', function () {
    var quote;

    beforeEach(function () {
      quote = sinon.spy(helpers, 'quote');
    });

    afterEach(function () {
      quote.restore();
    });


    it('should omit quotes if an attribute does not require any', function () {
      expect(helpers.quote(html.attribs.href)).to.be.equal('http://without.params.com');
      expect(helpers.quote(html.attribs.name)).to.be.equal('temp-name');
      expect(helpers.quote(html.attribs.type)).to.be.equal('text');
    });

    it('should always quote an attribute ending with /', function () {
      expect(helpers.quote('path/')).to.be.equal('"path/"');
    });

    it('should add quotes to attributes with spaces or =', function () {
      expect(helpers.quote(html.attribs.class)).to.be.equal('"some classes with spaces"');
      expect(helpers.quote(html.attribs.hrefparam)).to.be.equal('"http://with.params.com?test=test"');
    });

    it('should always retain quotes if configured', function () {
      var configurable = new Helpers({ quotes: true });
      expect(configurable.quote(html.attribs.name)).to.be.equal('"temp-name"');
      expect(configurable.quote(html.attribs.type)).to.be.equal('"text"');
      expect(configurable.quote(html.attribs.class)).to.be.equal('"some classes with spaces"');
    });
  });

  describe('function tag', function () {
    var structure, attr;

    beforeEach(function () {
      structure = sinon.spy(helpers, 'structure');
      attr = sinon.spy(helpers, 'attributes');
    });

    afterEach(function () {
      structure.restore();
      attr.restore();
    });

    it('returns a string wrapped with < >', function () {
      expect(helpers.tag(html.block)).to.be.equal('<section>');

      expect(structure).to.be.calledOnce;
    });

    it('calls helpers#attributes once and appends content behind name', function () {
      expect(helpers.tag(html.singular)).to.be.equal('<input type=text name=temp>');

      expect(attr).to.be.calledAfter(structure);
      expect(attr).to.be.calledOnce;
    });

    it('is callable by element.type through proxy', function () {
      expect(helpers.script(html.script, '')).to.be.equal(
        '<script type=text/javascript>'
      );

      expect(structure).to.be.calledOnce;
    });

    describe('prepends a space if the element', function () {
      it('is inline and prepended by text', function () {
        expect(helpers.tag(html.inline, 'text')).to.be.equal(
          ' <' + html.inline.name + '>'
        );

        expect(structure).to.be.calledOnce;
      });

      it('is inline and prepended by interpunction', function () {
        expect(helpers.tag(html.inline, 'text.')).to.be.equal(
          ' <' + html.inline.name + '>'
        );

        expect(structure).to.be.calledOnce;
      });

      it('is inline and prepended by closing tag', function () {
        expect(helpers.tag(html.inline, 'text</b>')).to.be.equal(
          ' <' + html.inline.name + '>'
        );

        expect(structure).to.be.calledOnce;
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
    var structure;

    beforeEach(function () {
      structure = sinon.spy(helpers, 'structure');
    });

    afterEach(function () {
      structure.restore();
    });

    it('only generates closing element for tags and scripts', function () {
      var result = helpers.close(html.doctype);

      expect(result).to.equal('');
      expect(result).to.be.a('string');
      expect(result.length).to.equal(0);
      expect(structure).to.be.calledOnce;
    });

    it('returns a string wrapped with </ >', function () {
      var result = helpers.close(html.element);

      expect(result).to.equal('</html>');
      expect(result).to.be.a('string');
      expect(structure).to.be.calledOnce;
    });

    it('returns an empty string if element.type is wrong', function () {
      var result = helpers.close(html.singular);

      expect(result).to.equal('');
      expect(result).to.be.a('string');
      expect(result.length).to.equal(0);
      expect(structure).to.be.calledOnce;
    });
  });

  describe('function isStyle', function () {
    it('returns true if an element is of type style', function () {
      expect(helpers.isStyle(html.style)).to.be.true;
    });
  });

  describe('function isJS', function () {
    afterEach(function () {
      html.script.name = 'script';
      html.script.attribs = { type: 'text/javascript' }
    });

    it('returns false if element is not of type script', function () {
      expect(helpers.isJS(html.inline)).to.be.false;
    });

    it('returns true if type is script and has no attributes', function () {
      html.script.attribs = {};
      expect(helpers.isJS(html.script)).to.be.true;
    });

    it('returns true if type is script and has random attributes', function () {
      html.script.attribs = { 'data-type': 'test' };
      expect(helpers.isJS(html.script)).to.be.true;
    });

    it('returns true if type is script and attribute === "text/javascript"', function () {
      expect(helpers.isJS(html.script)).to.be.true;
    });

    it('returns false if type !== "text/javascript"', function () {
      html.script.attribs.type = 'text/template';
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

    it('returns true if element is textarea', function () {
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
      helpers.ancestor = [];
    });

    it('trims whitespace', function () {
      html.text.data += '   ';
      var result = helpers.text(html.text, '');

      expect(result).to.be.equal(text);
    });

    it('replaces whitelines and spaces in non structural elements', function () {
      var result = helpers.text(html.multiline, '');

      expect(result).to.be.equal(
        'some additional lines. some random text, and alot of spaces'
      );
    });

    it('retains structure if element requires structure', function () {
      helpers.ancestor = [ 'pre' ];

      expect(helpers.text(html.multiline, '')).to.be.equal(
        'some additional lines.\n\n some random text, and            alot of spaces'
      );
    });

    it('prepends space if current HTML ends with closing tag', function () {
      var result = helpers.text(html.text, 'some HTML</strong>');

      expect(result).to.be.equal(' ' + text);
    });

    it('prepends space if current HTML ends with word boundary', function () {
      var result = helpers.text(html.text, 'some HTML');

      expect(result).to.be.equal(' ' + text);
    });

    it('prepends no whitespace if text starts with interpunction', function () {
      html.text.data = '. ' + html.text.data;
      var result = helpers.text(html.text, 'some HTML');

      expect(result).to.be.equal(html.text.data);
    });

    it('prepends whitespace if text starts with a dash', function () {
      html.text.data = '- ' + html.text.data;
      var result = helpers.text(html.text, 'some HTML');

      expect(result).to.be.equal(' ' + html.text.data);
    });
  });

  describe('inline element list', function () {
    it('is an array', function () {
      expect(helpers.inline).to.be.an('array');
    });

    it('has all required elements', function () {
      expect(helpers.inline.length).to.be.equal(21);
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

  describe('structural collection', function () {
    it('matches pre or textarea', function () {
      expect(!!~helpers.structural.indexOf('pre')).to.be.true;
      expect(!!~helpers.structural.indexOf('textarea')).to.be.true;
      expect(!!~helpers.structural.indexOf('code')).to.be.true;
    });
  });

  describe('node collection', function () {
    it('matches tag, style or script', function () {
      expect(!!~helpers.node.indexOf('tag')).to.be.true;
      expect(!!~helpers.node.indexOf('script')).to.be.true;
      expect(!!~helpers.node.indexOf('style')).to.be.true;
    });
  });

  describe('redundant collection', function () {
    it('matches boolean attributes', function () {
      expect(!!~helpers.redundant.indexOf('disabled')).to.be.true;
      expect(!!~helpers.redundant.indexOf('multiple')).to.be.true;
      expect(!!~helpers.redundant.indexOf('muted')).to.be.true;
      expect(!!~helpers.redundant.indexOf('class')).to.be.false;
    });
  });

  describe('regular expression start', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.start); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches interpunction without dashes', function () {
      expect(helpers.start.test('-')).to.be.false;
      expect(helpers.start.test('.')).to.be.true;
    });
  });

  describe('regular expression retain', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.retain); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches interpunction without dashes', function () {
      expect(helpers.retain.test('data')).to.be.true;
      expect(helpers.retain.test('itemscope')).to.be.true;
    });
  });

  describe('regular expression end', function () {
    it('is a valid regular expression', function () {
      function regexp () { return new RegExp(helpers.end); }
      expect(regexp).to.not.throw(Error);
    });

    it('matches interpunction with dashes', function () {
      expect(helpers.end.test('-')).to.be.true;
      expect(helpers.end.test('.')).to.be.true;
    });
  });

  describe('regular expression cdata', function () {
    it('is a valid regular expression', function () {
      function regexp () {
        new RegExp(helpers.cdata.start);
        new RegExp(helpers.cdata.end);
      }

      expect(regexp).to.not.throw(Error);
    });

    it('matches closing and ending parts of CDATA', function () {
      expect(helpers.cdata.start.test('//<![CDATA[')).to.be.true;
      expect(helpers.cdata.end.test('//]]>')).to.be.true;
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

  describe('has options', function () {
    it('which are all false by default', function () {
      for (var key in helpers.config) {
        expect(helpers.config[key]).to.be.false;
      }
    });

    it('which are overideable with options', function () {
      var test = new Helpers({ empty: true });
      expect(test.config.empty).to.be.true;
    });
  });
});
