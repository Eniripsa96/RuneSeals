'use strict';

// The global game object containing everything
var game = game || {};

// A single rune in the wheel in the game
game.Rune = function(wheel, color, pos) {
    return {
    
        // Fields
        color: color,
        pos: pos,
        scale: wheel.scale,
        
        // Methods
        draw: this.runeMethods.draw
    };
};

// Methods for the rune object
game.runeMethods = {

    // Draws the rune to the canvas
    draw: function(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            ctx.canvas.width / 2 + this.pos.x * this.scale, 
            ctx.canvas.height / 2 + this.pos.y * this.scale, 
            30 * this.scale, 
            0, 
            Math.PI * 2
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
};