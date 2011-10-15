var APPLE_RADIUS = 5;

function Apple() {
	this.gameObject = new GameObject();
	this.gameObject.size = new Vector2D(APPLE_RADIUS * 2, APPLE_RADIUS * 2);
	this.gameObject.velocity = new Vector2D(0, 0);
	this.following = null;
}
 
Apple.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.gameObject.position.x, this.gameObject.position.y, APPLE_RADIUS, 0, 2 * Math.PI, false);
	context.fillStyle = "yellow";
	context.fill();
	context.closePath();
}

Apple.prototype.update = function(gameContainer) {
	if (!this.following && collide(gameContainer.hero, this)) {
		var apples = gameContainer.hero.apples;
		this.following = apples[apples.length - 1] ? apples[apples.length - 1] : gameContainer.hero;
		apples.push(this);
	}
	if (this.following) {
		this.gameObject.velocity.y = (this.following.gameObject.position.y - this.gameObject.position.y) / 6;
		this.gameObject.velocity.x = (this.following.gameObject.position.x - this.gameObject.position.x) / 6;
	}
	this.gameObject.position.y += this.gameObject.velocity.y;
	this.gameObject.position.x += this.gameObject.velocity.x;
	
	if (collide(gameContainer.base, this)) {
		gameContainer.addToScore(1);
		removeElementFromArray(this, gameContainer.gameObjects);
		var apples = gameContainer.hero.apples;
		var next = removeElementFromArray(this, apples);
		if (apples[next]) {
			apples[next].following = apples[next - 1]? apples[next - 1] : gameContainer.hero;
		}
	}
}

