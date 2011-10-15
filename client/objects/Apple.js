var APPLE_RADIUS = 5;

function Apple() {
	this.gameObject = new GameObject();
	this.gameObject.size = new Vector2D(APPLE_RADIUS * 2, APPLE_RADIUS * 2);
}
 
Apple.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.gameObject.position.x, this.gameObject.position.y, APPLE_RADIUS, 0, 2 * Math.PI, false);
	context.fillStyle = "yellow";
	context.fill();
	context.closePath();
}

Apple.prototype.update = function(gameContainer) {
	if (collide(gameContainer.hero, this)) {
		gameContainer.hero.apples++;
		gameContainer.gameObjects.splice(gameContainer.gameObjects.indexOf(this), 1);
	}
}

