var should = require('should');

var net = require('../uc-network-mgmt.js')();
var mat = require('../uc-math.js');

describe('*uc-network-mgmt', function() {
  describe('#init', function() {
    it('uc-network-mgmt module loaded', function() {
      
      return should.exist(net, '\'net\' is undefined.');      
    });

    it('Test loading 6 default traks ', function() {
      var nmPromise = net.init();

      return nmPromise.then(function(arr) {
        return arr.length.should.be.eql(6, 'Networks\' array should has 6 items');
      });
    });

    it('uc-network-mgmt vlidate name', function() {
      var str = net.networks[0].name;

      return str.should.be.eql('track1.json', 'Invalid network name, should be equal to file name.');      
    });
  });
});

