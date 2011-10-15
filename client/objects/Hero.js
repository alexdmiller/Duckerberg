var DEFAULT_POWER = 0.3;
var FRICTION = 0.99;
var GRAVITY = new Vector2D(0, 0);

var LEFT_KEY = 65;
var UP_KEY = 87;
var RIGHT_KEY = 68;
var DOWN_KEY = 83;

function Hero() {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(20, 20);
    this.power = DEFAULT_POWER;
    this.keys = [];
}

Hero.prototype.draw = function(context) {
	context.beginPath();
    context.fillRect(this.gameObject.position.x, this.gameObject.position.y,
        this.gameObject.size.x, this.gameObject.size.y);
	context.closePath();
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
    this.gameObject.velocity = this.gameObject.velocity.multiply(FRICTION);
    this.gameObject.velocity = this.gameObject.velocity.add(GRAVITY);
    this.gameObject.updatePosition();
}

Hero.prototype.onKeyDown = function(keyCode) {
    if (this.keys.indexOf(keyCode) < 0) {
        this.keys.push(keyCode);
    }
}

Hero.prototype.onKeyUp = function(keyCode) {
    this.keys.splice(this.keys.indexOf(keyCode), 1);
}