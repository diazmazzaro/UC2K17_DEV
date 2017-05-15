var should = require('should');

var pos = require('../uc-position.js')();
var mat = require('../uc-math.js');

describe('*uc-position', function() {
  describe('#init', function() {
    it('uc-position module loaded', function() {
      return should.exist(pos, '\'pos\' is undefined.');      
    });
  });

  describe('#isFloat', function() {
    it('Tesing valid Float', function() {
      var b = 10.01;      
      b.should.be.Number();
      
      var isB = pos.isFloat(b);
      return isB.should.be.True('The number must be float.');
    });

    it('Tesing invalid Float', function() {
      var a = 10;

      a.should.be.Number();
      var isA = pos.isFloat(a);
      return isA.should.be.False('The number must be an integer.');
    });
  });

  describe('#isFunction', function() {
    it('Tesing is function', function() {
      var a = function() { return 1;};
      var isA = pos.isFunction(a);     
      return isA.should.be.True('\'a\' should be a function.');
    });
    it('Tesing is not function', function() {
      var a = { b : 1};
      var isA = pos.isFunction(a);     
      isA.should.be.False('\'a\' shouldn\'t be a function.');
      var b = "Hi";
      var isB = pos.isFunction(a);     
      return isB.should.be.False('\'a\' shouldn\'t be a function.');
    });
  });

  describe('#getEcu', function() {
    it('Tesing getEcu by 2 points', function() {
      var a = pos.getEcu({x:0, y:1},{x:1, y:2});
      var isA = pos.isFunction(a);     
      return isA.should.be.True('\'a\' should be a function.');
    });

    it('Tesing getEcu by 2 points f(10)=2x + 1', function() {
      var a = pos.getEcu({x:0, y:1},{x:1, y:3});
      var val = a(10); 
      val.should.be.Number();
      return val.should.be.eql(21, 'Y value equal to 21.');
      
    });

    it('Tesing getEcu by x1, y1, x2, y2', function() {
      var a = pos.getEcu(0,1,1,2);
      var isA = pos.isFunction(a);     
      return isA.should.be.True('\'a\' should be a function.');
    });

    it('Tesing getEcu by x1, y1, x2, y2 f(7)=x + 3', function() {
      var a = pos.getEcu(0,3,1,4);
      var val = a(7); 
      val.should.be.Number();

      return val.should.be.eql(10, 'Y value equal to 11.');
    });

    it('Tesing getEcu by array ', function() {
      var a = pos.getEcu([0,1,1,2]);
      var isA = pos.isFunction(a);     
      return isA.should.be.True('\'a\' should be a function.');
    });

    it('Tesing getEcu by array f(2)=-x/2 + 3', function() {
      var a = pos.getEcu([0,3,1,2.5]);
      var val = a(2); 
      val.should.be.Number();

      return val.should.be.eql(2, 'Y value equal to 2.');
    });


    it('Tesing getEcu args consistency f(2)=-x/2 + 4', function() {
      var a = pos.getEcu({x:0,y:4},{x:1,y:3.5});
      var b = pos.getEcu(0,4,1,3.5);
      var c = pos.getEcu([0,4,1,3.5]);
      var val_a = a(2); 
      val_a.should.be.Number();
      val_a.should.be.eql(3, 'Y should be value equal to 3.');

      var val_b = b(2); 
      val_b.should.be.Number();
      val_b.should.be.eql(3, 'Y should be value equal to 3.');

      var val_c = c(2); 
      val_c.should.be.Number();
      val_c.should.be.eql(3, 'Y should be value equal to 3.');
      var _eq = val_a == val_b && val_b == val_c && val_a == val_c;
      return _eq.should.be.True('All request should be the same function.');
    });


    it('Tesing getEcu for costant f(x)= 15', function() {
      var a = pos.getEcu([0,15,10,15]);
      var val = a(2); 
      val.should.be.Number();
      val.should.be.eql(15, 'Y value equal to 15.');
      val = a(-53.6); 
      val.should.be.eql(15, 'Y value equal to 15.');
      val = a(20); 
      return val.should.be.eql(15, 'Y value equal to 15.');
    });
  });

  describe('#getM', function() {
    it('Tesing getM by 2 points {x:0, y:1},{x:1, y:2}', function() {
      var val = pos.getM({x:0, y:1},{x:1, y:2});
        
      return val.should.be.eql(1, 'M value equal to 1.');
    });
  });

  describe('#getDistance', function() {
    it('Tesing getDistance by 2 points', function() {
      var val = pos.getDistance({x:7, y:5},{x:4, y:1});
      
      return val.should.be.eql(5, 'Distance should be equal to 5.');
    });
  });

  describe('#getPoint', function() {
    it('Test Trigonometics Formulas.', function() {
      var m = pos.getM({x:7, y:5},{x:4, y:1});
      m.should.be.eql(4/3, 'Y value equal to 4/3.');
      
      var a = pos.getEcu({x:7, y:5},{x:4, y:1});
      
      var val = a(4); 
      val.should.be.Number();
      return val.should.be.eql(1, 'Y value equal to 1.');      
    });

    it('Tesing getXincrement from (4,1) distance 5.', function() {
      var val = pos.getXincrement({x:4, y:1}, Math.atan(pos.getM({x:7, y:5},{x:4, y:1})) , 5);
      return val.should.be.eql(7, 'Distance should be equal to 7.');
    });

    it('Tesing calculate point from (4,1) distance 5.', function() {
      var val = pos.getXincrement({x:4, y:1}, Math.atan(pos.getM({x:7, y:5},{x:4, y:1})) , 5);
      val.should.be.eql(7, 'Distance should be equal to 7.');
      var y = pos.getEcu({x:7, y:5},{x:4, y:1})(val);
      return y.should.be.eql(5, 'Y should be equal to 5.');
    });    
  });

});