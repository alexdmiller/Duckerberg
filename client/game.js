var GAME_WIDTH;
var GAME_HEIGHT;
var FPS = 60;
var INITIAL;
var DEFAULT_ENEMY_CONSTANT = 1; // bigger -> slower enemies
var DEFAULT_ENEMY_MAX = 10;
var DEFAULT_ENEMY_RESPONSE_RADIUS = 200;
var POWERUP_FREQUENCY = 0.01;
var MAX_POWERUPS = 3;

var damageConstant = 1;
var numPowerups = 0;

var gameContainer;
var canvas;
var state = "paused";

$(document).ready(function() {
    GAME_WIDTH = $(document).width() - 10;
    GAME_HEIGHT = $(document).height() - 10;
    canvas = document.createElement("canvas");
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    var container = $("#container");
    container.width(GAME_WIDTH);
    container.height(GAME_HEIGHT);
    container.append(canvas);
	setupSocket();
	setupUI();
    setupGame();
});

onTimer = function(time) {
    if (state == "paused") {
        $("#time").text(time + " seconds left until next round.");
        if (time > 6) { // game should be running
            setupGameObjects();
            state = "running";
        }
    } else if (state == "running") {
        $("#time").text(time + " seconds left! Get apples duck!!");
        if (time <= 6) {
            resetGame();
            state = "paused";
        }
    }
}

function resetGame() {
    gameContainer.gameObjects = new Array();
    gameContainer.gameObjects.push(gameContainer.hero);
    gameContainer.gameObjects.push(gameContainer.base);
    gameContainer.score = 0;
    $("#score").text("0");
    for (var i = 0; i < gameContainer.activePowerups; i++) {
        gameContainer.activePowerups[i].deactivate(this);
    }
    gameContainer.activePowerups = new Array();
    gameContainer.hero.gameObject.position.x = gameContainer.base.gameObject.position.x;
    gameContainer.hero.gameObject.position.y = gameContainer.base.gameObject.position.y;
    gameContainer.hero.gameObject.velocity.x = 0;
    gameContainer.hero.gameObject.velocity.y = 0;
    gameContainer.hero.health = gameContainer.hero.startHealth;
    gameContainer.hero.apples = new Array();
    numPowerups = 0;
    canvas.width = canvas.width;
}

function setupGame() {
    gameContainer = {
		gameObjects: new Array(),
		hero: new Hero(50, 50),
		base: new Base(GAME_WIDTH / 2, GAME_HEIGHT / 2),
		score: 0,
		enemyForceConstant: DEFAULT_ENEMY_CONSTANT,
		maxEnemySpeed: DEFAULT_ENEMY_MAX,
		responseRadius: DEFAULT_ENEMY_RESPONSE_RADIUS,
		activePowerups: new Array(),
		activatePowerup: function(p) {
            p.activate(gameContainer);
            gameContainer.activePowerups.push({
                ticks: p.duration,
                deactivate: p.deactivate,
                onFrame: p.onFrame
            });
		},
		update: function() {
		    if (state == "running") {
				canvas.width = canvas.width;
				for (var i = gameContainer.gameObjects.length - 1; i >= 0; i--) {
					gameContainer.gameObjects[i].draw(canvas.getContext("2d"));	
					gameContainer.gameObjects[i].update(gameContainer);
				}
				for (i = gameContainer.activePowerups.length - 1; i >= 0; i--) {
					gameContainer.activePowerups[i].onFrame(gameContainer);
					gameContainer.activePowerups[i].ticks--;
					if (gameContainer.activePowerups[i].ticks < 0) {
						gameContainer.activePowerups[i].deactivate(this);
						gameContainer.activePowerups.splice(i, 1);
					}
				}
				if (Math.random() < POWERUP_FREQUENCY && numPowerups < MAX_POWERUPS) {
					var p;
					var layPowerup = function() {	
						p = new Powerup(powerupNames[Math.floor(Math.random() * powerupNames.length)]);
						p.gameObject.position.x = Math.random() * GAME_WIDTH;
						p.gameObject.position.y = Math.random() * GAME_HEIGHT;
						return collide(p, gameContainer.base);
					}
					while (layPowerup()) { }
					gameContainer.gameObjects.push(p);
					numPowerups++;
					setTimeout(function() {
					    if (state == "running") {
					        removeElementFromArray(p, gameContainer.gameObjects);
                            numPowerups--;
					    }
                    }, Math.random() * 5000 + 5000);
				}
			}
		},
		heroDeath: function() {
            gameContainer.hero.gameObject.position.x = gameContainer.base.gameObject.position.x;
            gameContainer.hero.gameObject.position.y = gameContainer.base.gameObject.position.y;
            gameContainer.hero.health = gameContainer.hero.startHealth;
            gameContainer.hero.gameObject.velocity = new Vector2D(0, 0);
			gameContainer.hero.spawn(gameContainer);
			while (gameContainer.hero.apples.length > 0) {
				removeElementFromArray(gameContainer.hero.apples.shift(), gameContainer.gameObjects);
			}
		},
		addToScore: function(add) {
		    gameContainer.score += add;
		    $("#score").text(gameContainer.score);
			sendScore(gameContainer.score);
		}
	};
	
	// put score in middle
	$("#score").css("left", gameContainer.base.gameObject.position.x - $("#score").width() / 2);
	$("#score").css("top", gameContainer.base.gameObject.position.y - $("#score").height() / 2);
	
    gameContainer.gameWidth = GAME_WIDTH;
    gameContainer.gameHeight = GAME_HEIGHT;
    gameContainer.gameObjects.push(gameContainer.base);
    gameContainer.gameObjects.push(gameContainer.hero);
    gameContainer.hero.gameObject.position.x = gameContainer.base.gameObject.position.x;
    gameContainer.hero.gameObject.position.y = gameContainer.base.gameObject.position.y;
    gameContainer.timer = setInterval(updateGame, 1000 / FPS);
        
    $(document).keydown(function(event) {
        gameContainer.hero.onKeyDown(event.keyCode);
    });
    $(document).keyup(function(event) {
        gameContainer.hero.onKeyUp(event.keyCode);
    });
    setupGameObjects(gameContainer);
}

function collideWithPowerup(powerupName) {
    var p = powerups[powerupName];
	numPowerups--;
    if (p.type == "me") {
        gameContainer.activatePowerup(p);
        $("#message").text(p.name + "!");
    } else {
        sendPowerUp(powerupName);
        $("#message").text("Deployed '" + p.name + "'!");
    }
}

function updateGame() {
	gameContainer.update();
}

function setupGameObjects() {
    for (var i = 0; i < 20; i++) {
        var e = new Enemy();
        e.gameObject.position.x = Math.random() * GAME_WIDTH;
        e.gameObject.position.y = Math.random() * GAME_HEIGHT;
		if (!collide(e, gameContainer.base))
			gameContainer.gameObjects.push(e);
		else
			i--;
    }
	for (var i = 0; i < 30; i++) {
        var a = new Apple();
        a.gameObject.position.x = Math.random() * GAME_WIDTH;
        a.gameObject.position.y = Math.random() * GAME_HEIGHT;
		if (!collide(a, gameContainer.base))
			gameContainer.gameObjects.push(a);
		else
			i--;
	}
}

/* API for server */

onPowerUp = function(powerup) {
    $("#message").text(powerup.user_name + " deployed " + powerup.powerup_name + "!");
	gameContainer.activatePowerup(powerups[powerup["powerup_name"]]);
}

onEndGame = function() {

}


onUserId = function(id) {

}

onHighScores = function(scoreTable) {

}