var GAME_WIDTH;
var GAME_HEIGHT;
var FPS = 60;
var INITIAL

var gameContainer;
var canvas;

$(document).ready(function() {
    GAME_WIDTH = $(document).width();
    GAME_HEIGHT = $(document).height();
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
		update: function() {
			canvas.width = canvas.width;
			for (var i = 0; i < gameContainer.gameObjects.length; i++) {
				gameContainer.gameObjects[i].update(gameContainer);
			    gameContainer.gameObjects[i].draw(canvas.getContext("2d"));
			}
		},
		heroDeath: function() {
            gameContainer.hero.gameObject.position.x = gameContainer.base.gameObject.position.x;
            gameContainer.hero.gameObject.position.y = gameContainer.base.gameObject.position.y;
            gameContainer.hero.health = gameContainer.hero.startHealth;
		}
	};
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
        gameContainer.gameObjects.push(e);
    }
	for (var i = 0; i < 30; i++) {
        var a = new Apple();
        a.gameObject.position.x = Math.random() * GAME_WIDTH;
        a.gameObject.position.y = Math.random() * GAME_HEIGHT;
        gameContainer.gameObjects.push(a);	
	}
}