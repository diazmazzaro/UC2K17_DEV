// const feeder = require('./uc-network.js')();
// feeder.init();

var ws = require("nodejs-websocket")
const GeoJSON = require('geojson');
var journey = require('./uc-journey.js');
const elem = require('./uc-element.js');
var net = require('./uc-network-mgmt.js')();

module.exports = function(){
  var module = {};

  module.started = false;
  module.count = 0 ;

  module.journeys = [];

  module.startWs = function(){
    var server = ws.createServer(function (conn) {
      console.log("New connection");
      conn.on("text", function (str) {
        console.log("Received "+ str);
        if(!module.started){
          module.started = true;
          conn.sendText("RES:" + str.toUpperCase() + "!!!");   
        }
      })

      setInterval(function(){
        // console.log('module ----------------------------------------------------');
        // console.log(module);
        // console.log('conn ------------------------------------------------------');
        // console.log(conn);
        if(module.started){
          module.emitGoOn(conn);
          //module.started = false;
        }
      }, 2000);  

      conn.on("close", function (code, reason) {
        console.log("Connection closed");
      })
    }).listen(8001);
  };

  module.buildJourneys = function(){
    for(var i in net.networks){
      var jour = new journey({ id: elem.getUid(),
        name : net.networks[i].name,
        network : net.networks[i]
      });
      jour.start();
      module.journeys.push(jour);
    }
  }

  module.emitGoOn = function(conn){
    for(var i in module.journeys){
      var a = module.journeys[i].goOn();
        if(a){
          conn.sendText(JSON.stringify(GeoJSON.parse(a, {Point: ['y', 'x']})));
        }
    }
  }


  module.init = function(){
    net.init().then(function(nets){
      module.buildJourneys();
      module.startWs();
    });  
  }

  return module;
};