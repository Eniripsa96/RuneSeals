'use strict';

// The global game object containing everything
var game = game || {};

// A single ring in the wheel in the game
game.Ring = function(wheel, radius) {
    return {
        
        // Fields
        radius: radius,
        wheel: wheel,
        rotationCount: 0,
        rocks: undefined,
        rotationTarget: 180 / wheel.runesPerRing,
        rotationAxis: undefined,
        runes: this.ringMethods.generate(wheel, wheel.runesPerRing, radius, wheel.cos, wheel.sin),
        
        // Methods
        update: this.ringMethods.update,
        draw: this.ringMethods.draw,
        rotate: this.ringMethods.rotate,
        shift: this.ringMethods.shift,
        unshift: this.ringMethods.unshift,
        applyRotation: this.ringMethods.applyRotation,
        applyMouseDown: this.ringMethods.applyMouseDown,
        applyMouseUp: this.ringMethods.applyMouseUp
    };
};

// Methods for the ring object
game.ringMethods = {

    // Generates the runes for the ring
    generate: function(wheel, num, radius, c, s) {
    
        // Generates the runes
        var pos = game.math.Vector(1, 0);
        var list = [];
        for (var i = 0; i < num; i++) {
            list.push(game.Rune(wheel, i, pos.clone(), radius, game.images.get('rock' + Math.floor(Math.random() * game.value.ROCK_COUNT))));
            
            pos.rotate(c, s);
        }
        return list;
    },
    
    // Updates the ring, rotating it when applicable
    update: function() {
    
        // If dragging the ring, rotate it according to the mouse position
        if (this.rotationAxis) {
        
            // Get needed coordinates
            var x = game.canvas.width / 2;
            var y = game.canvas.height / 2;
            var mouse = game.mouse;
            
            // Get the dot product and the dot product of the normal
            var v = game.math.Vector(game.mouse.x - x, game.mouse.y - y);
            var nDot = v.normal().dot(this.rotationAxis);
            var dot = v.dot(this.rotationAxis);
            
            // Get the values to compare
            // Based on the formula    u (dot) v = |u||v|cos(A)
            var val1 = (dot * dot) / (v.lengthSq() * this.rotationAxis.lengthSq());
            var val2 = game.math.sq(game.value.ROTATION_COS);
            
            // If the mouse is in a position to rotate the ring, do so
            if (nDot != 0 && val1 < val2) {
                this.rotate(nDot > 0);
            }
        }
        
        // If the player let go out of position,
        // rotate the ring to the nearest desired position
        else if (this.rotationCount != 0) {
            var c1 = this.rotationCount > 0;
            var c2 = Math.abs(this.rotationCount) < this.rotationTarget / 16;
            this.rotate(c1 == c2);
        }
    },
    
    // Draws the ring by drawing each rune in the ring
    draw: function(ctx) {
        
        // Draws the circles for the ring
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, this.radius * this.wheel.scale, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        
        // Draws the runes
        game.applyMethodList(this.runes, 'draw', ctx);
    },
    
    // Rotates the ring by rotating each rune in the ring
    rotate: function(clockwise) {
    
        var m = clockwise ? -1 : 1;
        var c = game.value.ROTATION_COS;
        var s = m * game.value.ROTATION_SIN;
    
        // Rotate the runes
        for (var runeIndex in this.runes) {
            this.runes[runeIndex].direction.rotate(c, s);
        }
        
        // Rotate the rotation axis to compare to the mouse
        if (this.rotationAxis) {
            var x = game.canvas.width / 2;
            var y = game.canvas.height / 2;
            this.rotationAxis.rotate(c, s);
        }
        
        // Keep track of the number of rotations and the direction
        this.rotationCount += m;
        
        // If a move was made, apply switches and end the dragging
        if (Math.abs(this.rotationCount) == this.rotationTarget) {
            this.rotationAxis = undefined;
            this.rotationCount = 0;
            
            this.applyRotation(clockwise);
            game.screen.checkVictory();
        }
    },
    
    // Shifts the ring's runes around for shuffling the wheel
    shift: function(clockwise) {
        var m = clockwise ? -1 : 1;
        for (var runeIndex in this.runes) {
            this.runes[runeIndex].direction.rotate(this.wheel.cos, this.wheel.sin * m);
        }
        this.applyRotation(clockwise);
    },
    
    // Unshifts the ring's runes for an undo
    unshift: function(clockwise) {
        game.screen.switchAuto(this);
        this.shift(ring, !clockwise);
        game.screen.switchAuto(this);
    },
    
    // Applies switches and rearranges runes when rotating
    applyRotation: function(clockwise)
	{
        // Rearrange runes to fit the new orientation
		if(clockwise)
		{
			this.runes.push(this.runes.shift());
		}
		else
		{
			this.runes.unshift(this.runes.pop());
		}
		
        // Apply automatic switches
        game.screen.switchAuto(this);
	},
    
    // Mark where the mouse started if the player clicks on the ring
    // for dragging purposes
    applyMouseDown: function() {

        var mouse = game.mouse.clone();
        mouse.x -= game.canvas.width / 2;
        mouse.y -= game.canvas.height / 2;
        var s = this.wheel.scale;
        var dSq = mouse.lengthSq();
        
        if (dSq >= game.math.sq((this.radius - 50) * s) 
                && dSq <= game.math.sq((this.radius + 50) * s)) {
            this.rotationAxis = mouse;
        }
    },
    
    // Stop dragging when the player lets go
    applyMouseUp: function() {
        this.rotationAxis = undefined;
    }
};