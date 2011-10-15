var APPLE_RADIUS = 13;

function Apple() {
	this.gameObject = new GameObject();
	this.gameObject.size = new Vector2D(APPLE_RADIUS * 2, APPLE_RADIUS * 2);
	this.gameObject.velocity = new Vector2D(0, 0);
	this.following = null;
	this.img = new Image();
    this.img.src = "images/apple.png";
}
 
Apple.prototype.draw = function(context) {
    context.drawImage(this.img, this.gameObject.position.x - APPLE_RADIUS, this.gameObject.position.y - APPLE_RADIUS);
}

Apple.prototype.update = function(gameContainer) {
	var apples = gameContainer.hero.apples;
	if (!this.following && this == apples[0]) {
		this.following = gameContainer.hero;
	}
	for (var i = 1; i < apples.length; i++) {
		apples[i].following = apples[i - 1];
	}
	if (!this.following && collide(gameContainer.hero, this)) {
		this.following = apples[apples.length - 1] ? apples[apples.length - 1] : gameContainer.hero;
		apples.push(this);
	}
	if (collide(gameContainer.base, this)) {
		gameContainer.addToScore(Math.floor((apples.length - 1) / 5) + 1);
		removeElementFromArray(this, gameContainer.gameObjects);
		var next = removeElementFromArray(this, apples);
		if (apples[next])
			apples[next].following = apples[next - 1] ? apples[next - 1] : gameContainer.hero;
	}
	if (this.following) {
		this.gameObject.velocity.y = (this.following.gameObject.position.y - this.gameObject.position.y) / 6;
		this.gameObject.velocity.x = (this.following.gameObject.position.x - this.gameObject.position.x) / 6;
	}
	this.gameObject.position.y += this.gameObject.velocity.y;
	this.gameObject.position.x += this.gameObject.velocity.x;
	if (apples[0] && apples[0].gameObject.velocity.y == 0 && apples[0].gameObject.velocity.x == 0) {
		apples[0].following = gameContainer.hero;
		for (var i = 1; i < apples.length; i++) {
			if (!apples[i])
				apples.splice(i, 1);
			apples[i].following = apples[i - 1];
		}
	}

}

