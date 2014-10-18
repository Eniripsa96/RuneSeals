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
        enabled: [level < 2 || level > 5, true, level < 2 || level > 5],
        
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
    
        // Generate rings
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle)
        for (var i = 0; i < 3; i++) {
            this.rings.push(game.Ring(this, 214 + 124 * i, i));
        }
    },
    
    // Updates each ring of the wheel
    update: function() {
        game.applyMethodList(this.rings, 'update');
    },
    
    // Draws the wheel to the canvas, including all rings/runes
    draw: function(ctx) {
    
        // Draw the center of the wheel
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        var center = game.images.get('center');
        ctx.drawImage(
            center,
            -center.width * this.scale / 2,
            -center.height * this.scale / 2,
            center.width * this.scale,
            center.height * this.scale
        );  
        
        // Draw the interior circles to show what needs to go where
        for (var i = 0; i < this.runesPerRing; i++) {
            var sprite = game.images.get('rune' + i);
            ctx.drawImage(
                sprite, 
                -sprite.width * this.scale / 2, 
                (-sprite.height / 2 - 80) * this.scale, 
                sprite.width * this.scale, 
                sprite.height * this.scale
            );
            
            ctx.transform(this.cos, this.sin, -this.sin, this.cos, 0, 0);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw rings/runes
        for (var i = 0; i < this.rings.length; i++) {
            ctx.save();
            if (!this.enabled[i]) {
                ctx.globalAlpha *= 0.4;
            }
            this.rings[i].draw(ctx);
            ctx.restore();
        }
    },
    
    // Checks whether or not the wheel is solved
    isSolved: function() {
        for (var ringIndex in this.rings) {
            for (var i = 0; i < this.runesPerRing; i++) {
                if (this.rings[ringIndex].runes[i].id != i) {
                    return false;
                }
            }
        }
        return true;
    }
};