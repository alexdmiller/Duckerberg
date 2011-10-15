function Powerup(name) {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(40, 40);
    this.powerupName = name;
    this.img = new Image();
    this.img.src = "images/box.png";
}

Powerup.prototype.draw = function(context) {
    context.drawImage(this.img, this.gameObject.position.x - this.gameObject.size.x / 2, this.gameObject.position.y - this.gameObject.size.x / 2);
}

Powerup.prototype.update = function(game) {
    if (collide(game.hero, this)) {
        collideWithPowerup(this.powerupName);
        game.gameObjects.splice(game.gameObjects.indexOf(this), 1);
    }
}