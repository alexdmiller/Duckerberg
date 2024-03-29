var GAME_WIDTH;
var GAME_HEIGHT;
var FPS = 60;
var INITIAL;
var DEFAULT_ENEMY_CONSTANT = 1; // bigger -> slower enemies
var DEFAULT_ENEMY_MAX = 10;
var DEFAULT_ENEMY_RESPONSE_RADIUS = 200;
var POWERUP_FREQUENCY = .01;
var MAX_POWERUPS = 1;
var ROUND_TIME = 5;
var PIXELS_PER_ENEMY = 36000;

var damageConstant = 1;
var powerupAvailable = false;

var gameContainer;
var canvas;
var state = "paused";
var setup = false;

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
        if (time > ROUND_TIME) { // game should be running
            setupGameObjects();
			if(state =="paused")
				sendScores();
            state = "running";
            $("#roundOver").css("display", "none");
            $("#high_scores").css("left", "10px");
            $("#high_scores").css("bottom", "10px");
            $("#high_scores").removeAttr("top");
            $("#high_scores").css("font-size", "15px");
        }
    } else if (state == "running") {
        $("#time").text((time - ROUND_TIME) + " seconds left! Get apples duck!!");
        if (time <= ROUND_TIME) {
            sendScores();
			resetGame();
            state = "paused";
            $("#roundOver").css("display", "inline");
            $("#roundOver").css("left", ($(document).width() / 2 - $("#roundOver").width() / 2) + "px");
            $("#roundOver").css("top", ($(document).height() / 2 - $("#roundOver").height() / 2 - 100) + "px");
            $("#high_scores").css("left", ($(document).width() / 2 - $("#high_scores").width() / 2 - 50) + "px");
            $("#high_scores").css("top", ($(document).height() / 2 - $("#high_scores").height() / 2) + "px");
            $("#high_scores").css("font-size", "25px");
        }
    }
}

function resetGame() {
    gameContainer.gameObjects = new Array();
    gameContainer.gameObjects.push(gameContainer.hero);
    gameContainer.gameObjects.push(gameContainer.base);
    gameContainer.score = 0;
    $("#score").text("");
    for (var i = 0; i < gameContainer.activePowerups.length; i++) {
        gameContainer.activePowerups[i].deactivate(gameContainer);
    }
    gameContainer.activePowerups = new Array();
    gameContainer.hero.gameObject.position.x = gameContainer.base.gameObject.position.x;
    gameContainer.hero.gameObject.position.y = gameContainer.base.gameObject.position.y;
    gameContainer.hero.gameObject.velocity.x = 0;
    gameContainer.hero.gameObject.velocity.y = 0;
    gameContainer.hero.health = gameContainer.hero.startHealth;
    gameContainer.hero.apples = new Array();
    powerupAvailable = false;
    canvas.width = canvas.width;
}

function sendScores(){
	if(state == "running"){	
		console.log("SENDING SCORES");
		sendScore(gameContainer.score);
	}
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
						console.log('called');
						gameContainer.activePowerups[i].deactivate(this);
						gameContainer.activePowerups.splice(i, 1);

					}
				}
				if (Math.random() < POWERUP_FREQUENCY && !powerupAvailable) {
					var p = new Powerup(powerupNames[Math.floor(Math.random() * powerupNames.length)]);
					p.gameObject.position.x = Math.random() * GAME_WIDTH;
					p.gameObject.position.y = Math.random() * GAME_HEIGHT;
					while(collide(p, gameContainer.base)) {
						p.gameObject.position.x = Math.random() * GAME_WIDTH;
						p.gameObject.position.y = Math.random() * GAME_HEIGHT;
					}
					gameContainer.gameObjects.push(p);
					powerupAvailable = true;
					setTimeout(function() {
					    if (state == "running") {
					        removeElementFromArray(p, gameContainer.gameObjects);
                            powerupAvailable = false;
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
	gameContainer.updateScores = setInterval(sendScores, 1000);
		
    $(document).keydown(function(event) {
        gameContainer.hero.onKeyDown(event.keyCode);
    });
    $(document).keyup(function(event) {
        gameContainer.hero.onKeyUp(event.keyCode);
    });

    //setupGameObjects(gameContainer);
    //setup = true;
}

function collideWithPowerup(powerupName) {
    var p = powerups[powerupName];
	powerupAvailable = true;;
	var msg = "";
	var iconPath = p.icon;
    if (p.type == "me") {
        gameContainer.activatePowerup(p);
		msg = "<img src=\"" + iconPath + "\"> " + p.name + "!";
    } else {
        sendPowerUp(powerupName);
		msg = "<img src=\"" + iconPath + "\"> " + "Deployed '" + p.name + "'!";
    }
	displayNewMessage(msg); 	
}

function updateGame() {
	gameContainer.update();
}

function setupGameObjects() {
    for (var i = 0; i < GAME_WIDTH * GAME_HEIGHT / PIXELS_PER_ENEMY; i++) {
        var e = new Enemy();
        e.gameObject.position.x = Math.random() * GAME_WIDTH;
        e.gameObject.position.y = Math.random() * GAME_HEIGHT;
		if (!collide(e, gameContainer.base))
			gameContainer.gameObjects.push(e);
		else
			i--;
    }
	for (var i = 0; i < 50; i++) {
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
	displayNewMessage("<img src=\"" + powerups[powerup.powerup_name].icon + "\"> " + powerup.user_name + " deployed " + powerup.powerup_name + "!"); 	
	gameContainer.activatePowerup(powerups[powerup["powerup_name"]]);
}

onEndGame = function() {

}


onUserId = function(id) {

}

onHighScores = function(scoreTable) {

}