'use strict';

// The global game object containing everything
var game = game || {};

// The opening screen of the game that navigates to other screens
game.titleScreen = {

    // Fields
    content: [
        game.Button('Play', 0.03, 0.53, 0.3, 0.08, function() {
            console.log('Play button pressed');
            game.gameScreen.level = 1;
            game.setScreen(game.gameScreen);
        }),
        game.Button('Level Select', 0.03, 0.68, 0.3, 0.08, function() {
            console.log('Level select button presesd');
            game.setScreen(game.levelScreen);
        }),
        game.Button('Credits', 0.03, 0.83, 0.3, 0.08, function() {
            console.log('Credits button pressed');
        })
    ],
    
    // Sets up the screen, setting up mouse event handlers
    setup: function() {
        game.mouseup = this.clickButtons.bind(this);
    },
    
    // Updates the screen by updating the screen's content
    update: function() {
        game.applyMethodList(this.content, 'update');
    },
    
    // Draws the screen by drawing the screen's content
    draw: function(ctx) {
	
		// Draw the title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + (0.15 * ctx.canvas.height) + 'px "Rock Salt"';
        ctx.textBaseline = 'middle';
        var text = 'Rune Seals';
        var size = ctx.measureText(text);
        ctx.fillText(text, ctx.canvas.width * 0.05, 0.1 * ctx.canvas.height);
	
		// Draw the buttons
        game.applyMethodList(this.content, 'draw', ctx);
    },
    
    // Passes click events to buttons
    clickButtons: function() {
        game.applyMethodList(this.content, 'applyClick');
    }
};