var powerups = {
    speed: {
        name: "Speed Up",
        type: "me",
        duration: 100,
        activate: function(game) {
            console.log("activate");
        },
        onFrame: function(game) {
            console.log("on frame");
        },
        deactivate: function(game) {
            console.log("deactivate");            
        }
    }
}