'use strict';

var chai = require('chai'),
    expect = chai.expect,
    minimize = require('../lib/minimize');

chai.Assertion.includeStack = true;

describe('Helpers', function () {
  describe('is a module', function () {
    it('which has a function tag', function () {
    });

    it('which has a function close', function () {
    });

    it('which has a function text', function () {
    });

    it('which exposes a map', function () {
    });
  });

  describe('function tag', function () {
    it('returns a string wrapped with < >', function () {
    });

    describe('prepends a space if the element', function () {
      it('is inline and prepended by text', function () {
      });

      it('is inlnie and prepended by closing tag', function () {
      });
    });
  });

  describe('function close', function () {
    it('only generates closing element for tags and scripts', function () {
    });

    it('returns a string wrapped with </ >', function () {
    });

    it('returns an empty string if element.type is wrong', function () {
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
    });

    it('returns true if element is pre or textarea', function () {
    });

    it('returns true if element is script of type text/javascript', function () {
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
    });

    it('has all required elements', function () {
    });
  });

  describe('regular expression flow', function () {
    it('is a valid regular expression', function () {
    });

    it('can detect if last part of string is closing tag', function () {
    });

    it('can detect if last part of string is text', function () {
    });
  });
});
