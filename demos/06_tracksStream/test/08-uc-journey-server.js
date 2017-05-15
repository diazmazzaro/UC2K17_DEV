var should = require('should');

var journey = require('../uc-journey-server.js')();

describe('*uc-journey-server', function() {
  describe('#init', function() {
    it('uc-journey-server module loaded', function() {
      return should.exist(journey, '\'journey\' is undefined.');      
    });

    it('Has init method.', function() {
      return should.exist(journey.init, '\'init\' is undefined.');      
    });

    it('Has startWs method.', function() {
      return should.exist(journey.startWs, '\'startWs\' is undefined.');      
    });

    it('Has buildJourneys method.', function() {
      return should.exist(journey.buildJourneys, '\'buildJourneys\' is undefined.');      
    });

    it('Has emitGoOn method.', function() {
      return should.exist(journey.emitGoOn, '\'emitGoOn\' is undefined.');      
    });
  });
});
