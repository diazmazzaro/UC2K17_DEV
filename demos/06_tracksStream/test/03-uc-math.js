var should = require('should');

var mat = require('../uc-math.js');

describe('*uc-math', function() {
  describe('#init', function() {
    it('uc-math module loaded', function() {
      return should.exist(mat, '\'pos\' is undefined.');      
    });
  });

  describe('#cot', function() {
    it('Tesing valid cot', function() {
      var val = mat.cot(1);
      return val.should.be.Number('Y value equal to 11.');
    });
  });

  describe('#degToRad', function() {
    it('Tesing valid degToRad', function() {
      var val = mat.degToRad(45);
      val.should.be.Number();
      return val.should.be.eql(Math.PI / 4, 'Y value equal to PI/4.');
    });
  });

  describe('#radToDeg', function() {
    it('Tesing valid radToDeg', function() {
      var val = mat.radToDeg(Math.PI / 4);
      val.should.be.Number();
      return val.should.be.eql(45, 'Y value equal to PI/4.');
    });
  });
});