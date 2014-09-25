'use strict';

var game = game || {};

game.Wheel = function(level, runesPerRing) {
    return {
        level: level,
        runesPerRing: runesPerRing,
        scale: Math.min((game.canvas.height * 0.9) / 1024, (game.canvas.width * 0.9) / 1024),
        angle: Math.PI * 2 / runesPerRing,
        cos: undefined,
        sin: undefined,
        
        rings: [],
        
        generate: this.wheelMethods.generate,
        update: this.wheelMethods.update,
        draw: this.wheelMethods.draw
    };
};

game.wheelMethods = {
    generate: function() {
        this.cos = Math.cos(this.angle);
        this.sin = Math.sin(this.angle)
        for (var i = 0; i < 3; i++) {
            this.rings.push(game.Ring(this, 214 + 124 * i));
        }
    },
    update: function() {
        game.applyMethodList(this.rings, 'update');
    },
    draw: function(ctx) {
        var x = ctx.canvas.width / 2;
        var y = ctx.canvas.height / 2;
        var r = this.scale * 512;
        ctx.drawImage(game.images.get('wheel'), x - r, y - r, 2 * r, 2 * r);
        
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
        
        game.applyMethodList(this.rings, 'draw', ctx);
    }
};