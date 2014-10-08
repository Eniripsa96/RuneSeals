'use strict';

// The global game object containing everything
var game = game || {};

// A single ring in the wheel in the game
game.Ring = function(wheel, radius, id) {
    return {
        
        // Fields
        radius: radius,
        wheel: wheel,
        rotationCount: 0,
        rocks: undefined,
        rotationTarget: 180 / wheel.runesPerRing,
        rotationAxis: undefined,
        debris: this.ringMethods.createDebris(id, wheel),
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
    
    // Creates debris for the ring using the given ID
    createDebris: function(id, wheel) {

        var list = [];
    
        // Get initial data
        var rockAngle = game.value.GEM_ROCK_ANGLES[id];
        var debrisAngle = game.value.DEBRIS_ANGLES[id];
        var openAngle = (360 - rockAngle * wheel.runesPerRing) / wheel.runesPerRing;
        
        // Make sure there's at least one debris piece per space
        var debrisPerSection = Math.floor(openAngle / debrisAngle);
        if (debrisPerSection == 0) {
            return list;
        }
        
        // Calculate the angle between each one
        var extraSpace = openAngle - debrisPerSection * debrisAngle;
        var spaceAngle = extraSpace / (debrisPerSection + 1);
        
        // Fill in the debris
        for (var i = 0; i < wheel.runesPerRing; i++) {
            var angle = i * wheel.angle + (rockAngle / 2 + spaceAngle + debrisAngle / 2) * Math.PI / 180;
            for (var j = 0; j < debrisPerSection; j++) {
                var a = angle + j * (spaceAngle + debrisAngle) * Math.PI / 180;
                list.push({
                    dir: game.math.Vector(Math.cos(a), Math.sin(a)),
                    sprite: game.images.get('debris' + game.math.rand(game.value.DEBRIS_COUNT))
                });
            }
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
        
        // Draw the debris
        for (var debrisIndex in this.debris) {
            var debris = this.debris[debrisIndex];
            ctx.transform(debris.dir.x, debris.dir.y, -debris.dir.y, debris.dir.x, ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.drawImage(
                debris.sprite, 
                -debris.sprite.width * this.wheel.scale / 2, 
                (-debris.sprite.height / 2 - this.radius) * this.wheel.scale, 
                debris.sprite.width * this.wheel.scale, 
                debris.sprite.height * this.wheel.scale
            );
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
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
        
        // Rotate the debris
        for (var debrisIndex in this.debris) {
            this.debris[debrisIndex].dir.rotate(c, s);
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
            game.screen.moves.push({ rotation: true, ring: this, clockwise: clockwise });
            game.screen.checkVictory();
        }
    },
    
    // Shifts the ring's runes around for shuffling the wheel
    shift: function(clockwise) {
        var m = clockwise ? -1 : 1;
        for (var runeIndex in this.runes) {
            this.runes[runeIndex].direction.rotate(this.wheel.cos, this.wheel.sin * m);
        }
        for (var debrisIndex in this.debris) {
            this.debris[debrisIndex].dir.rotate(this.wheel.cos, this.wheel.sin * m);
        }
        this.applyRotation(clockwise);
    },
    
    // Unshifts the ring's runes for an undo
    unshift: function(clockwise) {
        game.screen.switchAuto(this);
        this.shift(!clockwise);
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