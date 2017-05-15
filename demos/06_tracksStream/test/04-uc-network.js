var should = require('should');

var net = require('../uc-network.js');
var mat = require('../uc-math.js');
var arr = [{x : -58.37971553206444,
            y : -34.625297858957076
          },{x : -58.38065966963768,
            y : -34.622896443825184}];

var point = {x : -58.38194712996483,
             y : -34.591813038651445}
var point2 = {x : -58.38194712996483,
            y: -34.589693291869175}

var lessp = {x : -58.37971,
             y : -34.6252 };

var morep = {x : -58.3797155320644439,
            y : -34.62529785895707625 };

var lesspE = {x : -58.38194,
              y : -34.59181}
var morepE = {x : -58.3819471299648356,
             y : -34.59181303865144598}

var n = null;

describe('*uc-network', function() {
  describe('#init', function() {
    it('uc-network module loaded', function() {
      
      return should.exist(net, '\'net\' is undefined.');      
    });
  });

  describe('#Obj', function() {
    it('New instance module loaded', function() {
      n = new net();
      return should.exist(n, '\'n\' is undefined.');      
    });
  });

  describe('#push', function() {
    it('Loading segments by rray of points (one segment)', function() {
      arr.length.should.be.eql(2, 'The arr var should has 2 items');
      n.push(arr);
      
      should.exist(n.points, '\'points\' is undefined.');
      n.points.should.be.Array();
      n.points.length.should.be.eql(2, 'Point\'s array should has 2 items');

      should.exist(n.segments, '\'segments\' is undefined.');
      n.segments.should.be.Array();  
      return n.segments.length.should.be.eql(1, 'Segment\'s array should has 1 items');
    });

    it('Adding one point (should generate a new segment)', function() {
      
      n.push(point);
      n.points.length.should.be.eql(3, 'Point\'s array should has 3 items');

      should.exist(n.segments, '\'segments\' is undefined.');
      n.segments.should.be.Array();  
      return n.segments.length.should.be.eql(2, 'Segment\'s array should has 2 items');
    });
  });

  describe('#isStart', function() {
    it('Testing isStart with first element of array', function() {
      var isStart = n.isStart(arr[0]);
      return isStart.should.be.True();  
    });

    it('Testing isStart with less presition element', function() {
      var isStart = n.isStart(lessp);
      return isStart.should.be.True();  
    });

    it('Testing isStart with more presition element', function() {
      var isStart = n.isStart(morep);
      return isStart.should.be.True();  
    });
  });

  describe('#isEnd', function() {
    it('Testing isEnd with last element of array', function() {
      var isEnd = n.isEnd(n.points.slice(-1)[0]);
      return isEnd.should.be.True();  
    });

    it('Testing isEnd with less presition element', function() {
      var isEnd = n.isEnd(lesspE);
      return isEnd.should.be.True();  
    });

    it('Testing isEnd with more presition element', function() {
      var isEnd = n.isEnd(morepE);
      return isEnd.should.be.True();  
    });

    it('Testing add point and validate isEnd', function() {
      n.push(point2);

      n.points.length.should.be.eql(4, 'Point\'s array should has 2 items');
      n.segments.length.should.be.eql(3, 'Segment\'s array should has 3 items');

      var isEnd = n.isEnd(point2);
      return isEnd.should.be.True();  
    });
  });
});