var RADIUS = 80;

var safe;

function Base(x, y) {
	this.gameObject = new GameObject();
	this.gameObject.position = new Vector2D(x, y);
}
	
Base.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.gameObject.position.x, this.gameObject.position.y, RADIUS, 0, 2 * Math.PI, false);
	context.fillStyle = "black";
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = "green";
	context.stroke();
	context.closePath();
}

Base.prototype.update = function(gameContainer) {
	var heroX = gameContainer.hero.gameObject.position.x;
	var heroY = gameContainer.hero.gameObject.position.y;
	/*if ( )
		safe = true;
	else
		safe = false;*/
}

Base.prototype.containsHero = function() {
	return safe;
}

