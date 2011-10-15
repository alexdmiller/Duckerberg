var DEFAULT_POWER = 0.3;
var FRICTION = 0.9;
var GRAVITY = new Vector2D(0, 0);

var LEFT_KEY = 65;
var UP_KEY = 87;
var RIGHT_KEY = 68;
var DOWN_KEY = 83;

var START_HEALTH = 10;

function Hero() {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(20, 20);
    this.power = DEFAULT_POWER;
    this.keys = [];
    this.health = START_HEALTH;
    
}

Hero.prototype.draw = function(context) {
    context.save();
    context.translate(this.gameObject.position.x, this.gameObject.position.y);
    context.fillStyle = "#000000";
    context.beginPath();
    context.arc(0, 0, this.gameObject.size.x / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    
    context.fillStyle = "#0000FF";
    context.beginPath();
    if (this.health > 0) {
        context.arc(0, 0, (this.health / START_HEALTH) * this.gameObject.size.x / 2, 0, Math.PI * 2, true);
    }
    context.closePath();
    context.fill();
    
    context.restore();
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