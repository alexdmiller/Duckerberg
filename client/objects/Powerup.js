function Powerup(name) {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(50, 50);
    this.powerupName = name;
}

Powerup.prototype.draw = function(context) {
    context.save();
    context.translate(this.gameObject.position.x, this.gameObject.position.y);
    context.fillStyle = "#FF00FF";
    context.beginPath();
    context.arc(0, 0, this.gameObject.size.x / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.restore();
}

Powerup.prototype.update = function(game) {
    if (collide(game.hero, this)) {
        collideWithPowerup(this.powerupName);
        game.gameObjects.splice(game.gameObjects.indexOf(this), 1);
    }
}