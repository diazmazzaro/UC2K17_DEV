
const path = require('path');
const fs = require('fs');
var mercator = require('./uc-mercator.js');
var network = require('./uc-network.js');

module.exports = function(args){
  var module = {};
  module.useMercator = true;
  module.networks = [];
  module._network = path.join(path.dirname(fs.realpathSync(__filename)), '/networks');
  module.readGeoJson = function(obj){
    return obj.features[0].geometry.coordinates;
  }
  module.getCoordinates = function (obj){
    var arr = module.readGeoJson(obj);
    var coors = [];
    for(var i in arr)
      if(module.useMercator)
        coors.push(mercator.geoToMercator(arr[i][0], arr[i][1]));
      else
        coors.push(arr[i][0], arr[i][1]);
    return coors;
  }
  module.init = function(){

    var prom = new Promise(function(resolve, reject){
      fs.readdir(module._network, function(err, items) {
          if(err)
            reject(err);
          else{
            for (var i=0; i<items.length; i++) {
                var _net = new network();
                _net.name = items[i];
                _net.push(module.getCoordinates(require('./networks/' + items[i])));
                module.networks.push(_net);
            }
            
            resolve(module.networks);
          }
      });
    });
    return prom;
  };
  return module;
};


// function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
//     var R = 6378.137; // Radius of earth in KM
//     var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
//     var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
//     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     var d = R * c;
//     return d * 1000; // meters
// }