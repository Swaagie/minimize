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

  describe('function requiresFlow', function () {
    it('returns false if element is text', function () {
    });

    it('returns true if element is pre or textarea', function () {
    });

    it('returns true if element is script of type text/javascript', function () {
    });
  });
});
