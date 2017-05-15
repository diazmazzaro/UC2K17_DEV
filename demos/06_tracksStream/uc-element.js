module.exports = {
	getRandomX : function(){
	  return this.randomPosNeg() * this.randomFloat(0, 174).toFixed(5);
	},

	getRandomY : function(){
	  
	  return this.randomPosNeg() * this.randomFloat(0, 89).toFixed(5);
	},

	getFixedDate : function(multi){
	  var tmp1 = new Date();
	  tmp1.setDate(tmp1.getDate() + multi);
	  return tmp1;
	},

	getUid : function()
	{
	    return this.randomInt(100000,175000);
	},

	getUstrId : function()
	{
	    return "i" + this.getUid() + "d";
	},

	randomInt : function (min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	},

	randomFloat : function (min,max)
	{
		var _min = Number(min) * 1.00;
		var _max = Number(max) * 1.00;
	    return (Math.random() * (_max - _min) + _min)
	},

	randomPosNeg : function(){
		return Math.random() < 0.5 ? -1 : 1;
	}
}