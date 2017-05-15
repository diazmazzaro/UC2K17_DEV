
module.exports = {
  cot : function(m){
    return 1 / Math.tan(m);
  },
  sec : function (x){
   return 1 / Math.cos(x);
  },
  degToRad : function(angle) {
    return angle * (Math.PI / 180);
  },
  radToDeg : function(angle) {
    return angle * (180 / Math.PI);
  }
};