function Enemy() {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(10, 10);
}

Enemy.prototype.draw = function(context) {
    context.save();
    context.translate(this.gameObject.position.x, this.gameObject.position.y);
    context.fillStyle = "#FF0000";
    context.beginPath();
    context.arc(0, 0, this.gameObject.size.x, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.restore();
}

Enemy.prototype.update = function(game) {
    this.gameObject.updatePosition();
    if (collide(game.hero, this)) {
        game.heroDeath();
    }
}