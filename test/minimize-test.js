'use strict';

var chai = require('chai'),
    expect = chai.expect,
    minimize = require('../lib/minimize');

chai.Assertion.includeStack = true;

describe('Minimize', function () {
  describe('is module', function () {
    it('which has minify', function () {
      expect(minimize).to.have.property('minimize');
      expect(minimize.minimize).to.be.a('function');
    });

    it('which has helpers', function () {
      expect(minimize).to.have.property('helpers');
      expect(minimize.helpers).to.be.a('function');
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

    it('previous element is stored while reducing', function () {
    });
  });
});
