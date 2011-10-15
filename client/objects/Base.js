var BASE_RADIUS = 80;

var safe;

function Base(x, y) {
	this.gameObject = new GameObject();
	this.gameObject.position = new Vector2D(x, y);
	this.gameObject.size = new Vector2D(BASE_RADIUS * 2, BASE_RADIUS * 2);
}
	
Base.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.gameObject.position.x, this.gameObject.position.y, BASE_RADIUS, 0, 2 * Math.PI, false);
	context.lineWidth = 5;
	context.strokeStyle = "green";
	context.stroke();
	context.closePath();
}

Base.prototype.update = function(gameContainer) {
	if (collide(gameContainer.hero, this)) {
		var apples = gameContainer.hero.apples;
		if (apples.length > 0) {
			gameContainer.addToScore(apples.length);
			apples.sort();
			for (var i = 0; i < gameContainer.gameObjects.length && apples.length > 0; i++) {
				if (gameContainer.gameObjects[i] == apples[0]) {
					gameContainer.gameObjects.splice(i, 1);
					apples.shift();
					i--;
				}
			}
		}
		safe = true;
	} else {
		safe = false;
	}
}

Base.prototype.containsHero = function() {
	return safe;
}

