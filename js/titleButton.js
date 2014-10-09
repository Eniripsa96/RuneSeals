'use strict';

// The global game object containing everything
var game = game || {};

// A simple button to be used in menus
game.TitleButton = function(text, y, width, height, callback) {
    return {
    
        // Fields
        text: text,
        y: y,
        width: width,
        oWidth: width,
        maxWidth: width * 1.25,
        height: height,
        hovered: false,
        
        // Methods
        update: this.titleButtonMethods.update,
        draw: this.titleButtonMethods.draw,
        applyClick: this.titleButtonMethods.applyClick,
        callback: callback
    };
}

// The methods for buttons
game.titleButtonMethods = {

    // Updates whether or not the button is currently hovered
    update: function() {
    
        var y = this.y * game.canvas.height;
        var w = this.width * game.canvas.width;
        var h = this.height * game.canvas.width;
        
        this.hovered = game.mouse.y >= y && game.mouse.x <= w && game.mouse.y <= y + h;
    },
    
    // Draws the button to the canvas
    draw: function(ctx) {
    
        // Change the color if hovered
        if (this.hovered) {
            ctx.fillStyle = '#555';
            ctx.strokeStyle = '#666';
            if (this.width < this.maxWidth) {
                this.width += 0.02;
            }
        }
        else {
            ctx.fillStyle = '#222';
            ctx.strokeStyle = '#666';
            if (this.width > this.oWidth) {
                this.width -= 0.02;
            }
        }
        
        // Draw the button
        var y = this.y * ctx.canvas.height;
        var w = this.width * ctx.canvas.width;
        var h = this.height * ctx.canvas.width;
        var r = h / 5;
        ctx.lineWidth = r / 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w - h * 3 / 4, y);
        ctx.lineTo(w, y + h * 3 / 4);
        ctx.lineTo(w, y + h);
        ctx.lineTo(0, y + h);
        ctx.fill();
        ctx.stroke();
        
        // Set the color for text
        ctx.fillStyle = '#fff';
        
        // Draw the text on top of the button
        ctx.font = 'bold ' + (0.6 * h) + 'px "Bree Serif"';
        ctx.textBaseline = 'middle';
        var size = ctx.measureText(this.text);
        ctx.fillText(this.text, (w - size.width) / 2, y + h / 2);
    },
    
    // Calls the callback function when clicked
    applyClick: function() {
        if (this.hovered && !this.disabled) {
            this.callback();
        }
    }
};