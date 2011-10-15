var SPLATTER_RADIUS = 300;

function Splatter() {
	this.gameObject = new GameObject();
	this.gameObject.position = new Vector2D($(document).width(), $(document).height());
	this.gameObject.size = new Vector2D(SPLATTER_RADIUS * 2, SPLATTER_RADIUS * 2);
}

Splatter.prototype.update = function(gameContainer) {}

Splatter.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.gameObject.position.x, this.gameObject.position.y, SPLATTER_RADIUS, 0, Math.PI * 2, false);
	context.fillStyle = "black";
	context.fill();
	context.closePath();
}