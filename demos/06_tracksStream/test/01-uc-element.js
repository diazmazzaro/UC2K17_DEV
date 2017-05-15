var should = require('should');

var elem = require('../uc-element.js');


var isFloat = function (n){
    return Number(n) === n && n % 1 !== 0;
}

describe('*uc-element', function() {
  describe('#init', function() {
    it('uc-element module loaded', function() {
      return should.exist(elem, '\'elem\' is undefined.');      
    });
  });

  describe('#randomId', function() {
    it('Tesing randomInt', function() {
      var a = elem.randomInt(1000,2000);
      a.should.be.Number();
      a.should.be.belowOrEqual(2000, 'The number must be below or equal than 2.');
      return a.should.be.aboveOrEqual(1000, 'The number must be above or equal than 1.');
    });

    it('Tesing randomInt as real Random', function() {
      var a = elem.randomInt(1000,2000);      
      var b = elem.randomInt(1000,2000);      
      var c = elem.randomInt(1000,2000);      
      var eq = c == b && b == a && a == c;

      return eq.should.be.False('Random numbers faild, all numbers are :\'' + a + '\'.');      
    });
    it('Tesing random element id', function() {
      var a = elem.getUid();
      a.should.be.Number();
      a.should.be.belowOrEqual(175000, 'The number must be below or equal than 2.');
      return a.should.be.aboveOrEqual(100000, 'The number must be above or equal than 1.');
    });
  });

  describe('#randomPosition', function() {
    it('Tesing randomPosNeg', function() {
      var a = elem.randomPosNeg();      
      a.should.be.Number('The number must be integer.');
      var _isNegativeOrPositiveUnit = a == -1 || a == 1;
      _isNegativeOrPositiveUnit.should.be.True('The number must be Negative Or Positive Unit.');
      a.should.be.belowOrEqual(1, 'The number must be below or equal than 9.999.');
      return a.should.be.aboveOrEqual(-1, 'The number must be above or equal than 0.001.');
    });

    it('Tesing randomFloat', function() {
      var a = elem.randomFloat(0.001,9.999);
      var _isFloat = isFloat(a);
      _isFloat.should.be.True('The number must be float.');
      
      a.should.be.belowOrEqual(9.999, 'The number must be below or equal than 9.999.');
      return a.should.be.aboveOrEqual(0.001, 'The number must be above or equal than 0.001.');
    });

    it('Tesing randomFloat from ints frontiers', function() {
      var a = elem.randomFloat(0,9);
      var _isFloat = isFloat(a);
      _isFloat.should.be.True('The number must be float.');
      a.should.be.belowOrEqual(9.00, 'The number must be below or equal than 9.00.');
      return a.should.be.aboveOrEqual(0.00, 'The number must be above or equal than 0.00.');
    });

    it('Tesing randomFloat as real Random', function() {
      var a = elem.randomFloat(0.0,9.99);      
      var b = elem.randomFloat(0.0,9.99);      
      var c = elem.randomFloat(0.0,9.99);      
      var eq = c == b && b == a && a == c;
      return eq.should.be.False('Random numbers faild, all numbers are :\'' + a + '\'.');      
    });

    it('Tesing getRandomX value', function() {
      var a = elem.getRandomX();
      var _isFloat = isFloat(a);
      _isFloat.should.be.True('The number must be float.');
      a.should.be.belowOrEqual(180.00, 'The number must be below or equal than 180°.');
      return a.should.be.aboveOrEqual(-180.00, 'The number must be above or equal than -180°.');
    });

    it('Tesing getRandomY value', function() {
      var a = elem.getRandomY();
      var _isFloat = isFloat(a);
      _isFloat.should.be.True('The number must be float.');
      a.should.be.belowOrEqual(90.00, 'The number must be below or equal than 90°.');
      return a.should.be.aboveOrEqual(-90.00, 'The number must be above or equal than -90°.');
    });

    
  });

});