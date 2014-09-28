'use strict';

// The global game object containing everything
var game = game || {};

// A single rune in the wheel in the game
game.Rune = function(wheel, id, direction, radius, rock) {
    return {
    
        // Fields
        id: id,
        direction: direction,
        radius: radius,
        scale: wheel.scale,
        sprite: game.images.get('rune' + id),
        rock: rock,
        
        // Methods
        draw: this.runeMethods.draw
    };
};

// Methods for the rune object
game.runeMethods = {

    // Draws the rune to the canvas
    draw: function(ctx) {
        ctx.transform(this.direction.x, this.direction.y, -this.direction.y, this.direction.x, ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.drawImage(
            this.rock, 
            -this.rock.width * this.scale / 2, 
            (-this.rock.height / 2 - this.radius) * this.scale, 
            this.rock.width * this.scale, 
            this.rock.height * this.scale
        );
        ctx.drawImage(
            this.sprite, 
            -this.sprite.width * this.scale / 2, 
            (-this.sprite.height / 2 - this.radius) * this.scale, 
            this.sprite.width * this.scale, 
            this.sprite.height * this.scale
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
};