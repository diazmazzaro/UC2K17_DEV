var mat = require('./uc-math.js');

module.exports = function(args){
  var module = {};
  
  module.isFunction = function(functionToCheck) {
   var getType = {};
   return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };

  module.isFloat = function (n){
      return Number(n) === n && n % 1 !== 0;
  };

  module._getEcu = function(x1, y1, x2, y2){
    return function(x){
      if(x2-x1 == 0)
        return y1;
      else
        return ((x - x1) * (y2 - y1) / (x2-x1)) + y1;
    };
  };

  module._getEcuStr = function(x1, y1, x2, y2){
    return '((x - '+ x1 +') * (' +y2 + ' - ' + y1 + ') / (' + x2 + ' - ' + x1 + ')) + ' + y1;
  };

  module._getDistance = function(x1, y1, x2, y2){
      return Math.pow( Math.pow( x2-x1, 2)  + Math.pow(y2 - y1, 2), 1.00/2.00) ;    
  };  

  module._getM = function(x1, y1, x2, y2){
    if(x2-x1 == 0)
      return null;
    else
      return (y2 - y1) / ( x2 - x1);    
  };

  module._getXincrement = function(x1, y1, ang, n){
    return (n / mat.sec(ang)) + x1;    
  };

  module.getEcu = function(x1, y1, x2, y2){
    if(x1 instanceof Array)
      return module._getEcu(x1[0], x1[1], x1[2], x1[3]);
    if(isNaN(x1) && isNaN(x2))
      return module._getEcu(x1.x, x1.y, y1.x, y1.y);
    else
      return module._getEcu(x1, y1, x2, y2);
  };

   module.getM = function(x1, y1, x2, y2){
    if(x1 instanceof Array)
      return module._getM(x1[0], x1[1], x1[2], x1[3]);
    if(isNaN(x1) && isNaN(x2))
      return module._getM(x1.x, x1.y, y1.x, y1.y);
    else
      return module._getM(x1, y1, x2, y2);
  };

  module.getDistance = function(x1, y1, x2, y2){
    if(x1 instanceof Array)
      return module._getDistance(x1[0], x1[1], x1[2], x1[3]);
    if(isNaN(x1) && isNaN(x2))
      return module._getDistance(x1.x, x1.y, y1.x, y1.y);
    else
      return module._getDistance(x1, y1, x2, y2);
  };

  module.getXincrement = function(x1, y1, ang, n){
    if(isNaN(x1))
      return module._getXincrement(x1.x, x1.y, y1, ang);
    else
      return module._getXincrement(x1, y1, ang, n);
  };

  module.getXincrement = function(x1, y1, ang, n){
    if(isNaN(x1))
      return module._getXincrement(x1.x, x1.y, y1, ang);
    else
      return module._getXincrement(x1, y1, ang, n);
  };

  return module;
};