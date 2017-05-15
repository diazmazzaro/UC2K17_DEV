var should = require('should');
var elem = require('../uc-element.js');
var journey = require('../uc-journey.js');
var pos = require('../uc-position.js')();

var net = require('../uc-network-mgmt.js')();
net.init();

var jour = null;

describe('*uc-journey', function() {
  describe('#init', function() {
    it('uc-journey module loaded', function() {
      return should.exist(journey, '\'mat\' is undefined.');      
    });
  });

  describe('#instace', function() {
    it('uc-journey new instance', function() {
      var jour = new journey();
      
      should.not.exist(jour.element.id);
      should.exist(jour, '\'jour\' is undefined.');
      return jour.element.name.should.be.eql('');
    });
    var eid = elem.getUid();
    it('uc-journey new instance for: {id:\'' + eid + '\',name:\'test\', network:?}', function() {      
      jour = new journey({ id: eid, 
        name : 'test',
        network : net.networks[0]
      });

      should.exist(jour, '\'jour\' is undefined.');
      jour.element.id.should.be.eql(eid);
      should.exist(jour.network, '\'jour.network\' is undefined.');
            
      return jour.element.name.should.be.eql('test');
    });
  });

  describe('#start', function() {
    it('Starting journey', function() {
      jour.start();
      return should.exist(jour.current, '\'current\' is undefined.');
    });
  });

  describe('#getFullLength', function() {
    it('Testing getFullLength method', function() {
      return jour.getFullLength().should.be.Number();      
    });
  });

  describe('#goOn', function() {
    it('Testing goOn method', function() {
      var a = jour.goOn();
      //console.log(a);
      a = jour.goOn();
      //console.log(a);
      return should.exist(a, '\'current\' is undefined.');     
    });
    var eid = elem.getUid();
    it('Testing goOn to the end', function() {
      jour = new journey({ id: eid, 
        name : 'test',
        network : net.networks[0]
      });
      jour.start();
      // console.log('--- TEMP ---');
      var a = jour.goOn();

      while(a){
        // console.log(a);  
        // console.log('From: ' + jour.network.segments[0].from.x + '| ' + jour.network.segments[0].from.y 
        //   + ' To:' + jour.network.segments[0].to.x + '| ' + jour.network.segments[0].to.y);
        // console.log('--------');  
        a = jour.goOn();
      }
      // console.log(jour.network.segments[jour.network.segments.length - 1].to);
      // console.log(jour.current);
      // console.log(jour.network.isCloseTo(jour.current, jour.network.segments[jour.network.segments.length - 1].to, 10))
      var dist = pos.getDistance(jour.current, jour.network.segments[jour.network.segments.length - 1].to);
      // console.log(dist);
      dist.should.be.belowOrEqual(50, 'The distance of last point should be below or equal than 50.');
      return should.not.exist(a, '\'current\' is undefined.');     
    });
  });

});