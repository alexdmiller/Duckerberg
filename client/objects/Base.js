var RADIUS = 80;
var x;
var y;

function Base() {
	x = $(document).width() / 2;
	y = $(document).height() / 2;
}
	
Base.prototype.draw = function(context) {
	context.beginPath();
	context.arc(x, y, RADIUS, 0, 2 * Math.PI, false);
	context.fillStyle = "black";
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = "green";
	context.stroke();
	context.closePath();
}

Base.prototype.update = function(gameContainer) {

}

Base.prototype.containsHero = function() {

}

