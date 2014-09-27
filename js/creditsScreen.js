'use strict';

// The global game object containing everything
var game = game || {};

// The opening screen of the game that navigates to other screens
game.creditsScreen = {

    // Fields
    content: [
        game.Button('Back', 0.05, 0.86, 0.425, 0.05, function() {
            console.log('Back button pressed');
            game.setScreen(game.titleScreen);
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
        ctx.font = (0.15 * ctx.canvas.height) + 'px "Ceviche One"';
        ctx.textBaseline = 'middle';
        var text = 'Credits';
        var size = ctx.measureText(text);
        ctx.fillText(text, (ctx.canvas.width - size.width) / 2, 0.075 * ctx.canvas.height);
        
        // Draw boxes
        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#666';
        game.drawing.rect(ctx, 0.05 * ctx.canvas.width, 0.175 * ctx.canvas.height, 0.9 * ctx.canvas.width, 0.2 * ctx.canvas.height, 0.06 * ctx.canvas.height);
        ctx.fill();
        ctx.stroke();
        
        game.drawing.rect(ctx, 0.05 * ctx.canvas.width, 0.425 * ctx.canvas.height, 0.425 * ctx.canvas.width, 0.4 * ctx.canvas.height, 0.06 * ctx.canvas.height);
        ctx.fill();
        ctx.stroke();
        
        game.drawing.rect(ctx, 0.525 * ctx.canvas.width, 0.425 * ctx.canvas.height, 0.425 * ctx.canvas.width, 0.4 * ctx.canvas.height, 0.06 * ctx.canvas.height);
        ctx.fill();
        ctx.stroke();
        
        // Developer credits
        ctx.fillStyle = 'white';
        ctx.font = ctx.canvas.height * 0.075 + 'px "Bree Serif"';
        var text = 'Developed By Steven Sucy';
        var size = ctx.measureText(text);
        ctx.fillText(text, (ctx.canvas.width - size.width) / 2, 0.275 * ctx.canvas.height);
        
        // Font credits
        text = 'Fonts';
        size = ctx.measureText(text);
        ctx.font = ctx.canvas.height * 0.065 + 'px "Bree Serif"';
        ctx.fillText(text, ctx.canvas.width / 4 - size.width / 2, 0.475 * ctx.canvas.height);
        
        text = 'Cerviche One';
        size = ctx.measureText(text);
        ctx.font = ctx.canvas.height * 0.05 + 'px "Bree Serif"';
        ctx.fillText(text, ctx.canvas.width * 0.075, 0.575 * ctx.canvas.height);
        
        text = 'Bree Serif';
        size = ctx.measureText(text);
        ctx.font = ctx.canvas.height * 0.05 + 'px "Bree Serif"';
        ctx.fillText(text, ctx.canvas.width * 0.075, 0.7 * ctx.canvas.height);
        
        // Font authors
        text = 'By LatinoType';
        size = ctx.measureText(text);
        ctx.font = ctx.canvas.height * 0.04 + 'px "Bree Serif"';
        ctx.fillText(text, ctx.canvas.width * 0.1, 0.625 * ctx.canvas.height);
        
        text = 'By TypeTogether';
        size = ctx.measureText(text);
        ctx.font = ctx.canvas.height * 0.04 + 'px "Bree Serif"';
        ctx.fillText(text, ctx.canvas.width * 0.1, 0.75 * ctx.canvas.height);
        
		// Draw the buttons
        game.applyMethodList(this.content, 'draw', ctx);
    },
    
    // Passes click events to buttons
    clickButtons: function() {
        game.applyMethodList(this.content, 'applyClick');
    }
};