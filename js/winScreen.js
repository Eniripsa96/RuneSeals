'use strict';

// The global game object containing everything
var game = game || {};

game.winScreen = {

	// Fields
    content: [
        game.Button('Next Level', 0.3, 0.42, 0.4, 0.1, function() {
            console.log('Next button pressed');
			game.gameScreen.level++;
            game.setScreen(game.gameScreen);
        }).fill('black')
    ],
    
    // Sets up the screen, setting up mouse event handlers
    setup: function() {
        game.mouseup = this.clickButtons.bind(this);
		game.gameScreen = game.gameScreen;
    },
    
    // Updates the screen by updating the screen's content
    update: function() {
        game.applyMethodList(this.content, 'update');
    },
    
    // Draws the screen by drawing the screen's content
    draw: function(ctx) {
    
		game.gameScreen.draw(ctx);
	
        // Draw buttons
        game.applyMethodList(this.content, 'draw', ctx);
    },
    
    // Passes click events to buttons
    clickButtons: function() {
        game.applyMethodList(this.content, 'applyClick');
    }
};