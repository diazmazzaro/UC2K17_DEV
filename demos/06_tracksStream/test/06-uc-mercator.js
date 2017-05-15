var should = require('should');

var mat = require('../uc-mercator.js');

describe('*uc-mercator', function() {
  describe('#init', function() {
    it('uc-mercator module loaded', function() {
      return should.exist(mat, '\'mat\' is undefined.');      
    });
  });

  describe('#geoToMercator', function() {
    it('Tesing valid geoToMercator', function() {
      var val = mat.geoToMercator(45, 45);
      
      val.x.should.be.Number();
      return val.y.should.be.Number();
    });
  });

});