var SPEED = 4;

function Enemy() {
    this.gameObject = new GameObject();
    this.gameObject.size = new Vector2D(10, 10);
    this.damage = 0.1;
    this.gameObject.velocity = new Vector2D(Math.random() * SPEED - SPEED / 2, Math.random() * SPEED - SPEED / 2);
    this.following = false;
    this.img = new Image();
    this.img.src = "images/apple.png";
}

Enemy.prototype.draw = function(context) {
    if (this.gameObject.velocity.x > 0) {
       this.img.src = "images/man_right.png";
    } else {
       this.img.src = "images/man_left.png";
    }
    context.drawImage(this.img, this.gameObject.position.x - this.gameObject.size.x/2, this.gameObject.position.y - this.gameObject.size.x/2);
}

Enemy.prototype.update = function(game) {
    this.gameObject.updatePosition();
    if (collide(game.base, this)) {
        var dx = game.base.gameObject.position.x - this.gameObject.position.x;
        var dy = game.base.gameObject.position.y - this.gameObject.position.y;
        var angle = Math.atan2(-dy, -dx);
        var force = 2;
        this.gameObject.velocity.x = Math.cos(angle) * force;
        this.gameObject.velocity.y = Math.sin(angle) * force;
    } else if (!game.base.safe) {
        if (collide(game.hero, this)) {
            game.hero.health -= this.damage * damageConstant;
            if (game.hero.health < 0) {
                game.heroDeath();
            }
        } else {
            var dx = game.hero.gameObject.position.x - this.gameObject.position.x;
            var dy = game.hero.gameObject.position.y - this.gameObject.position.y;    
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < game.responseRadius) {
                this.following = true;
                var angle = Math.atan2(dy, dx);
                var force = (game.responseRadius / dist) / game.enemyForceConstant;
                if (force > game.maxEnemySpeed) {
                    force = game.maxEnemySpeed;
                }
                this.gameObject.velocity.x = Math.cos(angle) * force;
                this.gameObject.velocity.y = Math.sin(angle) * force;
            } else if (this.following) {
                this.following = false;
                this.gameObject.velocity = new Vector2D(Math.random() * SPEED - SPEED / 2, Math.random() * SPEED - SPEED / 2);
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
}