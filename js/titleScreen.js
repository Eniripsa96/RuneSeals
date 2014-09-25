'use strict';

var game = game || {};

game.titleScreen = {
    content: [
        game.Button('Play', 0.05, 0.50, 0.3, 0.08, function() {
            console.log('Play button pressed');
            game.gameScreen.level = 5;
            game.setScreen(game.gameScreen);
        }),
        game.Button('Help', 0.05, 0.65, 0.3, 0.08, function() {
            console.log('Help button presesd');
        }),
        game.Button('Credits', 0.05, 0.80, 0.3, 0.08, function() {
            console.log('Credits button pressed');
        })
    ],
    setup: function() {
        game.mouseup = this.clickButtons.bind(this);
    },
    update: function() {
        game.applyMethodList(this.content, 'update');
    },
    draw: function(ctx) {
        game.applyMethodList(this.content, 'draw', ctx);
    },
    clickButtons: function() {
        game.applyMethodList(this.content, 'applyClick');
    }
};