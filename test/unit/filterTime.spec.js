const { filterTime } = require('../../src/utils');
const { expect } = require('chai');

describe('filterTimeUtils', () => {
  describe('sould return undefined when a < 0', function() {
    it ('b > 0', function() {
      expect(filterTime(-1, 1)).to.be.equal(undefined);  
    })
    it('b < 0',  function() {
      expect(filterTime(-1, -1)).to.be.equal(undefined);
    })
    it('!b',  function() {
      expect(filterTime(-1, undefined)).to.be.equal(undefined);
      expect(filterTime(-1, null)).to.be.equal(undefined);
      expect(filterTime(-1, false)).to.be.equal(undefined);
      expect(filterTime(-1, 0)).to.be.equal(undefined);
    }) 
  })
  describe('shoule return undefined when b < 0', function() {
    it ('a > 0', function() {
      expect(filterTime(1, -1)).to.be.equal(undefined);  
    })
    it('a < 0',  function() {
      expect(filterTime(-1, -1)).to.be.equal(undefined);
    })
    it('!a',  function() {
      expect(filterTime(undefined, -1)).to.be.equal(undefined);
      expect(filterTime(null, -1)).to.be.equal(undefined);
      expect(filterTime(false, -1)).to.be.equal(undefined);
      expect(filterTime(0, -1)).to.be.equal(undefined);
    })
  })
  describe('should return undefined when a < b', function(){
    it('a > 0 && b > 0 && a < b', function() {
      expect(filterTime(1, 2)).to.be.equal(undefined);
    }) 
  })
  describe('should return a-b when a > b', function() {
    it('a > 0 && b > 0 && a > b', function() {
      expect(filterTime(2, 1)).to.be.equal(1);
    })
  })
})