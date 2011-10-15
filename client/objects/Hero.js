var DEFAULT_POWER = 2;
var FRICTION = 0.8;
var GRAVITY = new Vector2D(0, 0);

var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;

var START_HEALTH = 10;

function Hero() {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(50, 50);
    this.power = DEFAULT_POWER;
    this.keys = [];
    this.apples = new Array();
    this.startHealth = 10;
    this.health = this.startHealth;
    this.img = new Image();
    this.img.src = "images/duck.png";
	this.isSpawning = false;
	this.shouldShow = true;
}

Hero.prototype.draw = function(context) {
	if (this.shouldShow) {	
		if (this.gameObject.velocity.x > 0) {
			this.img.src = "images/duck.png";
		} else {
			this.img.src = "images/duck_left.png";
		}
		context.drawImage(this.img, this.gameObject.position.x - this.gameObject.size.x/2, this.gameObject.position.y - this.gameObject.size.x/2);
	}
}

Hero.prototype.update = function(game) {
    if (this.keys.indexOf(LEFT_KEY) >= 0) {
        // left
        this.gameObject.applyForce(-this.power, 0);
    }
    if (this.keys.indexOf(UP_KEY) >= 0) {
        // up
        this.gameObject.applyForce(0, -this.power);
    }
    if (this.keys.indexOf(RIGHT_KEY) >= 0) {
        // right
        this.gameObject.applyForce(this.power, 0);
    }
    if (this.keys.indexOf(DOWN_KEY) >= 0) {
        // down
        this.gameObject.applyForce(0, this.power);
    }
	if (this.gameObject.position.x < 0) {
        this.gameObject.velocity.x = 0;
		this.gameObject.position.x = 0;
    } else if (this.gameObject.position.x > GAME_WIDTH) {
		this.gameObject.velocity.x = 0; 
		this.gameObject.position.x = GAME_WIDTH;
    }
    if (this.gameObject.position.y < 0) {
		this.gameObject.velocity.y = 0;
        this.gameObject.position.y = 0;
    } else if (this.gameObject.position.y > GAME_HEIGHT) {
		this.gameObject.velocity.y = 0;
        this.gameObject.position.y = GAME_HEIGHT;
    }
    this.gameObject.velocity = this.gameObject.velocity.multiply(FRICTION);
    this.gameObject.updatePosition();
}

Hero.prototype.spawn = function(game) {
	game.hero.isSpawning = true;
	game.hero.shouldShow = true;
	this.keys = new Array();
	var interval = setInterval(function() {
		game.hero.shouldShow = !game.hero.shouldShow;
	}, 100);
	setTimeout(function() {
		game.hero.isSpawning = false;
		game.hero.shouldShow = true;
		clearInterval(interval);
	}, 1250);
}

Hero.prototype.onKeyDown = function(keyCode) {
    if (this.keys.indexOf(keyCode) < 0 && !this.isSpawning) {
        this.keys.push(keyCode);
    }
}

Hero.prototype.onKeyUp = function(keyCode) {
    this.keys.splice(this.keys.indexOf(keyCode), 1);
}