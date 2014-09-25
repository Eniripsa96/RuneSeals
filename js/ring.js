'use strict';

var game = game || {};

game.Ring = function(wheel, radius) {
    return {
        runes: this.ringMethods.generateRunes(wheel, wheel.runesPerRing, radius, wheel.cos, wheel.sin),
        radius: radius,
        wheel: wheel,
        rotationCount: 0,
        rotationTarget: 180 / wheel.runesPerRing,
        rotationAxis: undefined,
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

game.ringMethods = {
    generateRunes: function(wheel, num, radius, c, s) {
        var pos = game.math.Vector(0, -radius);
        var list = [];
        for (var i = 0; i < num; i++) {
            list.push(game.Rune(wheel, game.value.RUNE_COLORS[i], pos.clone()));
            
            pos.rotate(c, s);
        }
        return list;
    },
    update: function() {
        if (this.rotationAxis) {
            var x = game.canvas.width / 2;
            var y = game.canvas.height / 2;
            var mouse = game.mouse;
            
            var v = game.math.Vector(game.mouse.x - x, game.mouse.y - y);
            var nDot = v.normal().dot(this.rotationAxis);
            var dot = v.dot(this.rotationAxis);
            var val1 = (dot * dot) / (v.lengthSq() * this.rotationAxis.lengthSq());
            var val2 = game.math.sq(game.value.ROTATION_COS);
            if (nDot != 0 && val1 < val2) {
                this.rotate(nDot > 0);
            }
        }
        else if (this.rotationCount != 0) {
            var c1 = this.rotationCount > 0;
            var c2 = Math.abs(this.rotationCount) < this.rotationTarget / 2;
            this.rotate(c1 == c2);
        }
    },
    draw: function(ctx) {
        game.applyMethodList(this.runes, 'draw', ctx);
    },
    rotate: function(clockwise) {
        var m = clockwise ? -1 : 1;
        var c = game.value.ROTATION_COS;
        var s = m * game.value.ROTATION_SIN;
        for (var runeIndex in this.runes) {
            this.runes[runeIndex].pos.rotate(c, s);
        }
        if (this.rotationAxis) {
            var x = game.canvas.width / 2;
            var y = game.canvas.height / 2;
            this.rotationAxis.rotate(c, s);
        }
        this.rotationCount += m;
        
        if (Math.abs(this.rotationCount) == this.rotationTarget) {
            this.rotationAxis = undefined;
            this.rotationCount = 0;
            
            this.applyRotation(clockwise);
        }
    },
    shift: function(clockwise) {
        var m = clockwise ? -1 : 1;
        for (var runeIndex in this.runes) {
            this.runes[runeIndex].pos.rotate(this.wheel.cos, this.wheel.sin * m);
        }
        this.applyRotation(clockwise);
    },
    unshift: function(clockwise) {
        game.screen.switchAuto(this);
        this.shift(ring, !clockwise);
        game.screen.switchAuto(this);
    },
    applyRotation: function(clockwise)
	{
		if(clockwise)
		{
			this.runes.push(this.runes.shift());
		}
		else
		{
			this.runes.unshift(this.runes.pop());
		}
		
        game.screen.switchAuto(this);
	},
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
    applyMouseUp: function() {
        this.rotationAxis = undefined;
    }
};