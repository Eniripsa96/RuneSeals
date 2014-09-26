'use strict';

// The global game object containing everything
var game = game || {};

// The level selection screen of the game
game.levelScreen = {

    // Fields
    content: [
        game.Button('Back', 0.05, 0.86, 0.35, 0.05, function() {
            console.log('Back button pressed');
            game.setScreen(game.titleScreen);
        })
    ],
    
    // Sets up the screen, setting up mouse event handlers
    setup: function() {
    
        game.mouseup = this.clickButtons.bind(this);
        
        // Add the level buttons
        var best = game.userData.getNum('level');
        for (var i = 0; i < 100; i++) {
            this.content.push(game.Button(
                (i + 1).toString(),
                (i % 10) * 0.09 + 0.05,
                Math.floor(i / 10) * 0.07 + 0.15,
                0.08,
                0.04,
                function() {
                    console.log('Level ' + this.text + ' button pressed');
                    game.gameScreen.level = Number(this.text);
                    game.setScreen(game.gameScreen);
                },
                best < i
            ));
        }
    },
    
    // Updates the screen by updating the screen's content
    update: function() {
        game.applyMethodList(this.content, 'update');
    },
    
    // Draws the screen by drawing the screen's content
    draw: function(ctx) {
    
        // Draw the title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + (0.1 * ctx.canvas.height) + 'px Papyrus';
        ctx.textBaseline = 'middle';
        var text = 'Level Selection';
        var size = ctx.measureText(text);
        ctx.fillText(text, (ctx.canvas.width - size.width) / 2, 0.075 * ctx.canvas.height);
    
        // Draw buttons
        game.applyMethodList(this.content, 'draw', ctx);
    },
    
    // Passes click events to buttons
    clickButtons: function() {
        game.applyMethodList(this.content, 'applyClick');
    }
};