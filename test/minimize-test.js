'use strict';

var chai = require('chai'),
    expect = chai.expect,
    minimize = require('../lib/minimize');

chai.Assertion.includeStack = true;

describe('Minimize', function () {
  describe('is module', function () {
    it('which has minify', function () {
      expect(minimize).to.have.property('minimize');
    });

    it('which has helpers', function () {
      expect(minimize).to.have.property('helpers');
    });

    it('previous element is stored while reducing', function () {
    });
  });
});
