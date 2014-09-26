'use strict';

// The global game object containing everything
var game = game || {};

// A simple button to be used in menus
game.Button = function(text, x, y, width, height, callback, disabled) {
    return {
    
        // Fields
        text: text,
        x: x,
        y: y,
        width: width,
        height: height,
        hovered: false,
        disabled: disabled,
        
        // Methods
        update: this.buttonMethods.update,
        draw: this.buttonMethods.draw,
        applyClick: this.buttonMethods.applyClick,
        callback: callback
    };
}

// The methods for buttons
game.buttonMethods = {

    // Updates whether or not the button is currently hovered
    update: function() {
    
        var x = this.x * game.canvas.width;
        var y = this.y * game.canvas.height;
        var w = this.width * game.canvas.width;
        var h = this.height * game.canvas.width;
        
        this.hovered = game.mouse.x >= x && game.mouse.y >= y && game.mouse.x <= x + w && game.mouse.y <= y + h;
    },
    
    // Draws the button to the canvas
    draw: function(ctx) {
    
        var x = this.x * ctx.canvas.width;
        var y = this.y * ctx.canvas.height;
        var w = this.width * ctx.canvas.width;
        var h = this.height * ctx.canvas.width;
        var r = h / 5;
        
        // Change the color if hovered
        if (this.disabled) {
            ctx.fillStyle = '#333';
            ctx.strokeStyle = '#aaa';
        }
        else if (this.hovered) {
            ctx.fillStyle = '#aaa';
            ctx.strokeStyle = '#fff';
        }
        else {
            ctx.fillStyle = '#555';
            ctx.strokeStyle = '#ddd';
        }
        
        // Draw the rounded rectangle
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
        
        // Set the color for text
        if (this.disabled) {
            ctx.fillStyle = '#f66';
        }
        else {
            ctx.fillStyle = '#fff';
        }
        
        // Draw the text on top of the button
        ctx.font = 'bold ' + (0.4 * h) + 'px Papyrus';
        ctx.textBaseline = 'middle';
        var size = ctx.measureText(this.text);
        ctx.fillText(this.text, x + (w - size.width) / 2, y + h / 2);
    },
    
    // Calls the callback function when clicked
    applyClick: function() {
        if (this.hovered && !this.disabled) {
            this.callback();
        }
    }
};