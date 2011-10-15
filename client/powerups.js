var powerupNames = ["slowerEnemies", "fasterEnemies", "speed", "slow"];

var powerups = {
    speed: {
        name: "Speed Up",
        type: "me",
        duration: 200,
        activate: function(game) {
            game.hero.power *= 2;
        },
        onFrame: function(game) {},
        deactivate: function(game) {
            game.hero.power = DEFAULT_POWER;
        }
    },
    slow: {
        name: "Slow Down",
        type: "you",
        duration: 200,
        activate: function(game) {
            game.hero.power *= 0.5;
        },
        onFrame: function(game) {},
        deactivate: function(game) {
            game.hero.power = DEFAULT_POWER;
        }
    },
	splatter: {
		name: "Splatter",
		type: "you",
		duration: 3000,
		canvas: function() {
			var mycanvas = document.createElement("canvas");
			mycanvas.width = GAME_WIDTH;
			mycanvas.height = GAME_HEIGHT;
			return mycanvas;
		},
		activate: function(game) {
			canvas.beginPath();
			canvas.arc(300, 300, 300, 0, Math.PI * 2, false);
			canvas.fillStyle("black");
			canvas.fill();
			canvas.closePath();
		},
		onFrame: function(game) {},
		deactivate: function(game) {
			canvas.width = canvas.width;
		}
	},
    fasterEnemies: {
        name: "Faster Enemies",
        type: "you",
        duration: 100,
        activate: function(game) {
            game.maxEnemySpeed *= 10;
            game.responseRadius = 1000;
        },
        onFrame: function(game) {},
        deactivate: function(game) {
            console.log("DEACTIVATE");
            game.enemyForceConstant = DEFAULT_ENEMY_CONSTANT;
            game.maxEnemySpeed = DEFAULT_ENEMY_MAX;
            game.responseRadius = DEFAULT_ENEMY_RESPONSE_RADIUS;
        }
    },
    slowerEnemies: {
        name: "Slower Enemies",
        type: "me",
        duration: 100,
        activate: function(game) {
            game.maxEnemySpeed /= 10;
        },
        onFrame: function(game) {},
        deactivate: function(game) {
            game.enemyForceConstant = DEFAULT_ENEMY_CONSTANT;
            game.maxEnemySpeed = DEFAULT_ENEMY_MAX;
            game.responseRadius = DEFAULT_ENEMY_RESPONSE_RADIUS;
        }
    }
}