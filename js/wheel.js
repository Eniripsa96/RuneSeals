'use strict';

// The global game object containing everything
var game = game || {};

// A wheel in the game
game.Wheel = function(level, runesPerRing) {
    return {
    
        // Fields
        level: level,
        runesPerRing: runesPerRing,
        scale: Math.min((game.canvas.height * 0.9) / 1024, (game.canvas.width * 0.9) / 1024),
        angle: Math.PI * 2 / runesPerRing,
        cos: undefined,
        sin: undefined,    
        rings: [],
        
        // Methods
        generate: this.wheelMethods.generate,
        update: this.wheelMethods.update,
        draw: this.wheelMethods.draw,
        isSolved: this.wheelMethods.isSolved
    };
};

// Methods for the wheel object
game.wheelMethods = {

    // Generates the rings for the wheel
    generate: function() {
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle)
        for (var i = 0; i < 3; i++) {
            this.rings.push(game.Ring(this, 214 + 124 * i));
        }
    },
    
    // Updates each ring of the wheel
    update: function() {
        game.applyMethodList(this.rings, 'update');
    },
    
    // Draws the wheel to the canvas, including all rings/runes
    draw: function(ctx) {
    
        // Draw the wheel itself
        var x = ctx.canvas.width / 2;
        var y = ctx.canvas.height / 2;
        var r = this.scale * 512;
        ctx.drawImage(game.images.get('wheel'), x - r, y - r, 2 * r, 2 * r);
        
        // Draw the interior circles to show what needs to go where
        var pos = game.math.Vector(0, -120);
        for (var i = 0; i < this.runesPerRing; i++) {
            ctx.fillStyle = game.value.RUNE_COLORS[i];
            ctx.beginPath();
            ctx.arc(
                ctx.canvas.width / 2 + pos.x * this.scale, 
                ctx.canvas.height / 2 + pos.y * this.scale, 
                30 * this.scale, 
                0, 
                Math.PI * 2
            );
            ctx.closePath();
            ctx.fill();
            
            pos.rotate(this.cos, this.sin);
        }
        
        // Draw rings/runes
        game.applyMethodList(this.rings, 'draw', ctx);
    },
    
    // Checks whether or not the wheel is solved
    isSolved: function() {
        for (var ringIndex in this.rings) {
            for (var i = 0; i < this.runesPerRing; i++) {
                if (this.rings[ringIndex].runes[i].color != game.value.RUNE_COLORS[i]) {
                    return false;
                }
            }
        }
        return true;
    }
};