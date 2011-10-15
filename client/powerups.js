var powerups = {
    speed: {
        name: "Speed Up",
        type: "me",
        duration: 200,
        activate: function(game) {
            game.hero.power *= 2;
        },
        onFrame: function(game) {
//            console.log("on frame");
        },
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
	}
}