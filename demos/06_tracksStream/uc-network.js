
var UcNetwork = function(){
	this.name = '';
	this.json = {};
	this.segments = [];
	this.points = [];
	this.start = null;
	this.end = null;
	this.tolerance = 2;
}

UcNetwork.prototype.push = function(points){
	if (points){
		if(!this.points)
			this.points = [];

		if(points instanceof Array)
			for(var i in points)
				this.push(points[i]);
		else{
			if(this.points.length > 0)
				this.segments.push({ from : this.points.slice(-1)[0] , to : points});
			if(!this.start)
				this.start = points;

			this.end = points;
			this.points.push(points);
		}
	}
};

UcNetwork.prototype.isStart = function(p) {
	return this.isCloseTo(p, this.start, this.tolerance);
};

UcNetwork.prototype.isEnd = function(p) {
	return this.isCloseTo(p, this.end, this.tolerance);
};

UcNetwork.prototype.isCloseTo = function(p, r, tolerance) {
	if(p && r && p.x && r.x && p.y && r.y)
		if(p.x <= r.x + tolerance && p.x >= r.x - tolerance)
			return (p.y <= r.y + tolerance && p.y >= r.y - tolerance);
	return false;
};

module.exports = UcNetwork;