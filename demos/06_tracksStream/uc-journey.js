
var net = require('./uc-network.js');
var pos = require('./uc-position.js')();
var elem = require('./uc-element.js');

var UcJourney = function(args){
	this.element = {
		name : '',
		id : null,
		type : null
	};

	this._curSegment = 0;
	this._curIncrement = 0;
	this._m = 0;
	this.current = null;
	this.last = 100000000000;
	this.network = null;
	
	this.startTime = null;
	this.endTime = null;

	this.minSpeed = 0.5;
	this.maxSpeed = 55.7;
	
	if(args){
		if(args.network)
			this.network = args.network;
		if(args.id)
			this.element.id = args.id;
		if(args.name)
			this.element.name = args.name;
	}
}

UcJourney.prototype.start = function(){
	this.current = this.network.segments[this._curSegment].from;
	var end = this.network.segments[this._curSegment].to;
	this._m = pos.getM(this.current,this.network.segments[this._curSegment].to);

};

UcJourney.prototype.getFullLength = function(){
	var	total = 0.0;
	for(var i in this.network.segments){
		total += pos.getDistance(this.network.segments[i].from, this.network.segments[i].to);
	}
	

	return total;
};

UcJourney.prototype.getSpeed = function(){
	return elem.randomFloat(this.minSpeed,this.maxSpeed);

	return total;
};

UcJourney.prototype.nextSegment = function(){
	if(++this._curSegment >= this.network.segments.length)
		return null;

	return this._curSegment;
};

UcJourney.prototype.goOn = function(){
	if(this._curSegment >= this.network.segments.length)
		return null;
	var _cur = this.current;
	// console.log('Cur ---------');
	// console.log(_cur);
	// console.log('To ----------');	
	// console.log(this.network.segments[this._curSegment].to);
	var sp = this.getSpeed();
	// console.log('Speed -------');
	// console.log(sp);
	// console.log('m -----------');
	// console.log(pos.getM(_cur,this.network.segments[this._curSegment].to));
	// console.log('_x ----------');

	//var _x = pos.getXincrement(_cur, Math.atan(this._m) , sp * -1);
	_cur.segment = this._curSegment;
	if(!_cur.speed) _cur.speed = 0;
	var _x = pos.getXincrement(_cur, Math.atan(this._m) , sp * -1);
	// console.log(_x);
	var _y = pos.getEcu(_cur,this.network.segments[this._curSegment].to)(_x);
	var _new = { x: _x , y:_y};	
	//if (this.network.isCloseTo(_new, this.network.segments[this._curSegment].to, 10)){
	if (this.last <= pos.getDistance(_new, this.network.segments[this._curSegment].to)){
		
		if(!this.nextSegment()){
			//console.log(this._curSegment);
			return null;
		}
		else{
			_new = this.network.segments[this._curSegment].from;
		}
	}
	_new.segment = this._curSegment;
	_new.speed = sp;
	this.last = pos.getDistance(_new, this.network.segments[this._curSegment].to)
	this.current = _new;
	_cur.name = this.element.name;
	_cur.id = this.element.id;
	// console.log(pos.getDistance(_cur, this.current));
	// console.log(pos.getDistance(this.current, this.network.segments[this._curSegment].to));
	// console.log(pos.getDistance(this.network.segments[this._curSegment].from, this.network.segments[this._curSegment].to));
	
	return _cur;	
};

module.exports = UcJourney;