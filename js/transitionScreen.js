'use strict';

// The global game object containing everything
var game = game || {};

// A transitional screen that moves from one screen to another
game.transitionScreen = {

	// Fields
	fromScreen: undefined,
	toScreen: undefined,
	fadingOut: undefined,
	alpha: 1.0,
	
	// Starts transitioning from the first screen to the second
	transition: function(from, to) {
		this.fromScreen = from;
		this.toScreen = to;
		this.fadingOut = true;
		this.alpha = 1.0;
		game.setScreen(this);
	},
	
	// Doesn't require setup
	setup: function() { },
	
	// Updates the screen by updating the screen's content
    update: function() {
		
		// Change the alpha depending on whether or not it is fading out
		if (this.fadingOut) {
			this.alpha -= 0.025;
		}
		else {
			this.alpha += 0.025;
		}
		
		// Limit the alpha to the appropraite range
		if (this.alpha > 1) {
			this.alpha = 1;
		}
		else if (this.alpha < 0) {
			this.alpha = 0;
		}
		
		// Act when the fading is complete
		if (this.alpha == 0 && this.fadingOut) {
			this.fadingOut = false;
			if (this.toScreen.generate) {
				this.toScreen.generate();
			}
		}
		else if (this.alpha == 1 && !this.fadingOut) {
			game.setScreen(this.toScreen);
		}
    },
    
    // Draws the screen by drawing the screen's content
    draw: function(ctx) {
		ctx.globalAlpha = this.alpha;
		if (this.fadingOut) {
			this.fromScreen.draw(ctx);
		}
		else {
			this.toScreen.draw(ctx);
		}
		ctx.globalAlpha = 1;
    },
};