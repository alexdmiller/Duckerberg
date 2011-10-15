var GAME_WIDTH;
var GAME_HEIGHT;
var FPS = 60;
var INITIAL

var gameContainer;
var canvas;

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
    setupGame();
});

function setupGame() {
    gameContainer = {
		gameObjects : new Array(),
		hero: new Hero(50, 50),
		base: new Base($(document).width() / 2, $(document).height() / 2),
		score: 0,
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
			canvas.width = canvas.width;
			for (var i = 0; i < gameContainer.gameObjects.length; i++) {
				gameContainer.gameObjects[i].update(gameContainer);
			    gameContainer.gameObjects[i].draw(canvas.getContext("2d"));
			}
			for (i = gameContainer.activePowerups.length - 1; i >= 0; i--) {
			    gameContainer.activePowerups[i].onFrame(gameContainer);
			    gameContainer.activePowerups[i].ticks--;
			    if (gameContainer.activePowerups[i].ticks < 0) {
			        gameContainer.activePowerups[i].deactivate(this);
			        gameContainer.activePowerups.splice(i, 1);
			    }
			}
		},
		heroDeath: function() {
            gameContainer.hero.gameObject.position.x = gameContainer.base.gameObject.position.x;
            gameContainer.hero.gameObject.position.y = gameContainer.base.gameObject.position.y;
            gameContainer.hero.health = gameContainer.hero.startHealth;
            gameContainer.hero.gameContainer.velocity = new Vector2D(0, 0);
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
        
    $(document).keydown(function(event) {
        gameContainer.hero.onKeyDown(event.keyCode);
    });
    $(document).keyup(function(event) {
        gameContainer.hero.onKeyUp(event.keyCode);
    });
    setupGameObjects(gameContainer);
}

function updateGame() {
	gameContainer.update();
}

function setupGameObjects(gameContainer) {
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