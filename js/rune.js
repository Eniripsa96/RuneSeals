'use strict';

var game = game || {};

game.Rune = function(wheel, color, pos) {
    return {
        color: color,
        pos: pos,
        scale: wheel.scale,
        draw: this.runeMethods.draw
    };
};

game.runeMethods = {
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