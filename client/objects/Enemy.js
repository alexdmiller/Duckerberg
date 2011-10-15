function Enemy() {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(10, 10);
    this.damage = 0.1;
    this.gameObject.velocity = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
}

Enemy.prototype.draw = function(context) {
    context.save();
    context.translate(this.gameObject.position.x, this.gameObject.position.y);
    context.fillStyle = "#FF0000";
    context.beginPath();
    context.arc(0, 0, this.gameObject.size.x / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.restore();
}

Enemy.prototype.update = function(game) {
    this.gameObject.updatePosition();
    if (collide(game.hero, this)) {
        game.hero.health -= this.damage;
        if (game.hero.health < 0) {
            game.heroDeath();
        }
    }
    if (this.gameObject.position.x < 0) {
        this.gameObject.position.x = GAME_WIDTH;
    } else if (this.gameObject.position.x > GAME_WIDTH) {
        this.gameObject.position.x = 0;
    }
    if (this.gameObject.position.y < 0) {
        this.gameObject.position.y = GAME_HEIGHT;
    } else if (this.gameObject.position.y > GAME_HEIGHT) {
        this.gameObject.position.y = 0;
    }
}