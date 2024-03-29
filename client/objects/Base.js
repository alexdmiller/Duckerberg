var BASE_RADIUS = 80;

function Base(x, y) {
	this.gameObject = new GameObject();
	this.gameObject.position = new Vector2D(x, y);
	this.gameObject.size = new Vector2D(BASE_RADIUS * 2, BASE_RADIUS * 2);
	this.health = 0;
	this.safe;
}
	
Base.prototype.draw = function(context) {
    context.beginPath();
	context.arc(this.gameObject.position.x, this.gameObject.position.y, BASE_RADIUS, 0, Math.PI * 2, false);
	context.lineWidth = 10;
	context.strokeStyle = "#FFFFFF";
	context.stroke();
	context.closePath();
	
    context.beginPath();
    context.arc(this.gameObject.position.x, this.gameObject.position.y, BASE_RADIUS, 0, (this.health / 10) *  2 * Math.PI, false);
    context.lineWidth = 10;
    context.strokeStyle = "#25510a";
    context.stroke();
    context.closePath(); 
}

Base.prototype.update = function(gameContainer) {
    if (gameContainer.hero) {
        this.health = gameContainer.hero.health;
    	if (collide(gameContainer.hero, this)) {
    		if (gameContainer.hero.health < START_HEALTH) {
    			gameContainer.hero.health += 0.075;
    		}
    		this.safe = true;
    	} else {
    		this.safe = false;
    	}
    } else {
        console.log("HERO UNDEFINED");
    }
}

Base.prototype.containsHero = function() {
	return safe;
}

