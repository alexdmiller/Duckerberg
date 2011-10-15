var powerupNames = ["slowerEnemies", "fasterEnemies", "speed", "slow", "doubleDamage", "invert"];

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
    },
	invert: {
		name: "Invert",
		type: "you",
		duration: 100,
		activate: function(game) {
			var tempLeft = LEFT_KEY;
			LEFT_KEY = RIGHT_KEY;
			RIGHT_KEY = tempLeft;
			var tempUp = UP_KEY;
			UP_KEY = DOWN_KEY;
			DOWN_KEY = tempUp;
		},
		onFrame: function(game) {},
		deactivate: function(game) {
			var tempLeft = LEFT_KEY;
			LEFT_KEY = RIGHT_KEY;
			RIGHT_KEY = tempLeft;
			var tempUp = UP_KEY;
			UP_KEY = DOWN_KEY;
			DOWN_KEY = tempUp;
		}
	},
	doubleDamage: {
		name: "Double Damage",
		type: "you",
		duration: 100,
		activate: function(game) {
			damageConstant = 1.5;
		},
		onFrame: function(game) {},
		deactivate: function(game) {
			damageConstant = 1;
		}
	}
}