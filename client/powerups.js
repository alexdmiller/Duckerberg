var powerupNames = ["slowerEnemies", "fasterEnemies", "speed", "slow", "doubleDamage", "invert", "splat"];

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
			
        },
        icon: "images/arrow_up_green.png"
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
			
        },
        icon: "images/arrow_down_red.png"
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
			
        },
        icon: "images/arrow_up_red.png"
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
        },
        icon: "images/arrow_down_green.png"
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
		},
        icon: "images/question_mark.png"
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
		},
        icon: "images/arrow_up_red.png"
	},
	splat: {
	    name: "Splat",
	    type: "you",
	    duration: 100,
	    activate: function(game) {
	        $("#splat").css("display", "block");
	        $("#splat").css("top", GAME_HEIGHT / 2 - 800 / 2);
	        $("#splat").css("left", GAME_WIDTH / 2 - 800 / 2);
	    },
	    onFrame: function(game) {},
	    deactivate: function(game) {
	        $("#splat").css("display", "none");
	    },
        icon: "images/tiny_splat.png"
	}
}
