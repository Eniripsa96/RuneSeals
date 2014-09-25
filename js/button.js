'use strict';

var game = game || {};

game.Button = function(text, x, y, width, height, callback) {
    return {
        text: text,
        x: x,
        y: y,
        width: width,
        height: height,
        hovered: false,
        update: this.buttonMethods.update,
        draw: this.buttonMethods.draw,
        applyClick: this.buttonMethods.applyClick,
        callback: callback
    };
}

game.buttonMethods = {
    update: function() {
        var x = this.x * game.canvas.width;
        var y = this.y * game.canvas.height;
        var w = this.width * game.canvas.width;
        var h = this.height * game.canvas.width;
        
        this.hovered = game.mouse.x >= x && game.mouse.y >= y && game.mouse.x <= x + w && game.mouse.y <= y + h;
    },
    draw: function(ctx) {
        var x = this.x * ctx.canvas.width;
        var y = this.y * ctx.canvas.height;
        var w = this.width * ctx.canvas.width;
        var h = this.height * ctx.canvas.width;
        var r = h / 5;
        
        if (this.hovered) {
            ctx.fillStyle = '#aaa';
        }
        else {
            ctx.fillStyle = '#555';
        }
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = r / 3;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.font = 'bold ' + (0.4 * h) + 'px Papyrus';
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'middle';
        var size = ctx.measureText(this.text);
        ctx.fillText(this.text, x + (w - size.width) / 2, y + h / 2);
    },
    applyClick: function() {
        if (this.hovered) {
            this.callback();
        }
    }
};