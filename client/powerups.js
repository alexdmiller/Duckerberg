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
		type: "me",
		duration: 200,			
		object: new Splatter(),
		activate: function(game) {
			gameContainer.gameObjects.push(powerups.splatter.object);
		},
		onFrame: function(game) {},
		deactivate: function(game) {
			removeElementFromArray(powerups.splatter.object, gameContainer.gameObjects);
		}
	}
}