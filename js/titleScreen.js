'use strict';

// The global game object containing everything
var game = game || {};

// The opening screen of the game that navigates to other screens
game.titleScreen = {

    // Fields
    imageData: [
        game.math.Vector(1, 0), Math.cos(Math.PI / 1440), Math.sin(Math.PI / 1440),
        game.math.Vector(1, 0), Math.cos(Math.PI / 600), Math.sin(-Math.PI / 600),
        game.math.Vector(1, 0), Math.cos(Math.PI / 480), Math.sin(Math.PI / 480),
        game.math.Vector(1, 0), 1, 0
    ],
    content: [
        game.TitleButton('Play', 0.53, 0.35, 0.08, function() {
            console.log('Play button pressed');
            game.gameScreen.level = 100;
            game.setScreen(game.gameScreen);
        }),
        game.TitleButton('Level Select', 0.68, 0.35, 0.08, function() {
            console.log('Level select button presesd');
            game.setScreen(game.levelScreen);
        }),
        game.TitleButton('Credits', 0.83, 0.35, 0.08, function() {
            console.log('Credits button pressed');
            game.setScreen(game.creditsScreen);
        })
    ],
    song: 'menu',
               
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
        ctx.font = (0.3 * ctx.canvas.height) + 'px "Ceviche One"';
        ctx.textBaseline = 'middle';
        var text = 'Rune Seals';
        var size = ctx.measureText(text);
        ctx.fillText(text, ctx.canvas.width * 0.03, 0.1 * ctx.canvas.height);
        
        // Draw the rotating wheel
        for (var i = 0; i < 4; i++) {
            ctx.translate(game.canvas.width, game.canvas.height);
            var dx = this.imageData[i * 3].x;
            var dy = this.imageData[i * 3].y;
            var c = this.imageData[i * 3 + 1];
            var s = this.imageData[i * 3 + 2];
            ctx.transform(dx, dy, -dy, dx, 0, 0);
            this.imageData[i * 3].rotate(c, s);
            ctx.drawImage(game.images.get('titleImage' + (i + 1)), -game.canvas.width / 2, -game.canvas.width / 2, game.canvas.width, game.canvas.width);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
	
		// Draw the buttons
        game.applyMethodList(this.content, 'draw', ctx);
    },
    
    // Passes click events to buttons
    clickButtons: function() {
        game.applyMethodList(this.content, 'applyClick');
    }
};