var GAME_WIDTH;
var GAME_HEIGHT;
var FPS = 60;

var game;
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
    gameContainer = {};
    gameContainer.gameWidth = GAME_WIDTH;
    gameContainer.gameHeight = GAME_HEIGHT;
    gameContainer.hero = new Hero(50, 50);
    gameContainer.timer = setInterval(updateGame, 1000 / FPS);
    
    $(document).keydown(function(event) {
        gameContainer.hero.onKeyDown(event.keyCode);
    });
    $(document).keyup(function(event) {
        gameContainer.hero.onKeyUp(event.keyCode);
    });
}

function updateGame() {
    canvas.width = canvas.width;
    gameContainer.hero.update(game);
    gameContainer.hero.draw(canvas.getContext("2d"));
}