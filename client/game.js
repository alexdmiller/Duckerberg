var GAME_WIDTH = 500;
var GAME_HEIGHT = 500;
var FPS = 60;

var game;
var canvas;

$(document).ready(function() {
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
    game = {};
    game.gameWidth = GAME_WIDTH;
    game.gameHeight = GAME_HEIGHT;
    game.hero = new Hero(50, 50);
    game.timer = setInterval(updateGame, 1000 / FPS);
    
    $(document).keydown(function(event) {
        game.hero.onKeyDown(event.keyCode);
    });
    $(document).keyup(function(event) {
        game.hero.onKeyUp(event.keyCode);
    });
}

function updateGame() {
    canvas.width = canvas.width;
    game.hero.update(game);
    game.hero.draw(canvas.getContext("2d"));
}