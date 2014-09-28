'use strict';

// The global game object containing everything
var game = game || {};

// A single switch in the game, either manual or automatic
// It is automatic when a color isn't provided and manual otherwise
game.Switch = function(ring1, index1, ring2, index2, color) {
    var rune1 = ring1.runes[index1];
    var rune2 = ring2.runes[index2];
    return {
    
        // Fields
        rings: [ring1, ring2],
        indexes: [index1, index2],
        color: color,
        x: (rune1.direction.y * rune1.radius + rune2.direction.y * rune2.radius) / 2,
        y: (-rune1.direction.x * rune1.radius - rune2.direction.x * rune2.radius) / 2,
        scale: ring1.runes[index1].scale,
        
        // Methods
        draw: this.switchMethods.draw,
        apply: this.switchMethods.apply,
        getRune: this.switchMethods.getRune,
        applyClick: this.switchMethods.applyClick,
        applyRotation: this.switchMethods.applyRotation
    };
};

// Methods for the switch object
game.switchMethods = {

    // Draws the switch to the canvas
    draw: function(ctx) {
        var r = 30 * this.scale;
        var x = this.x * this.scale + ctx.canvas.width / 2;
        var y = this.y * this.scale + ctx.canvas.height / 2;
        
        ctx.fillStyle = this.color || '#000';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.drawImage(game.images.get('switch'), x - r, y - r, 2 * r, 2 * r);
    },
    
    // Applies the switch, swapping the target runes
    apply: function() {
        var rune1 = this.getRune(0);
        var rune2 = this.getRune(1);
        var id = rune1.id;
        var sprite = rune1.sprite;
        rune1.id = rune2.id;
        rune1.sprite = rune2.sprite;
        rune2.id = id;
        rune2.sprite = sprite;
    },
    
    // Gets a target rune by ID, 0 being the first, 1 being the second
    getRune: function(id) {
        return this.rings[id].runes[this.indexes[id]];
    },
    
    // Applies click events for manual switches, activating when clicked on
    applyClick: function() {
    
        // Must be manual
        if (this.color) {
        
            var r = 30 * this.scale;
            var x = this.x * this.scale + game.canvas.width / 2;
            var y = this.y * this.scale + game.canvas.height / 2;
            var mouse = game.mouse.clone();
            mouse.x -= x;
            mouse.y -= y;
        
            // Apply all switches of the same color when clicked on
            if (mouse.lengthSq() < r * r) {
                if (game.screen.switchColor) {
                    game.screen.switchColor(this.color);
                }
            }
        }
    },
    
    // Applies ring rotations for auto switches, activating when adjacent
    applyRotation: function(ring) {
        if (ring == this.rings[0] || ring == this.rings[1]) {
            this.apply();
        }
    }
};