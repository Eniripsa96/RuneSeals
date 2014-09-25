'use strict';

var game = game || {};

game.Switch = function(ring1, index1, ring2, index2, color) {
    return {
        rings: [ring1, ring2],
        indexes: [index1, index2],
        color: color,
        x: (ring1.runes[index1].pos.x + ring2.runes[index2].pos.x) / 2,
        y: (ring1.runes[index1].pos.y + ring2.runes[index2].pos.y) / 2,
        scale: ring1.runes[index1].scale,
        draw: this.switchMethods.draw,
        apply: this.switchMethods.apply,
        getRune: this.switchMethods.getRune,
        applyClick: this.switchMethods.applyClick,
        applyRotation: this.switchMethods.applyRotation
    };
};

game.switchMethods = {
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
    apply: function() {
        var rune1 = this.getRune(0);
        var rune2 = this.getRune(1);
        var c = rune1.color;
        rune1.color = rune2.color;
        rune2.color = c;
    },
    getRune: function(id) {
        return this.rings[id].runes[this.indexes[id]];
    },
    applyClick: function() {
        if (this.color) {
            var r = 30 * this.scale;
            var x = this.x * this.scale + game.canvas.width / 2;
            var y = this.y * this.scale + game.canvas.height / 2;
            var mouse = game.mouse.clone();
            mouse.x -= x;
            mouse.y -= y;
            
            if (mouse.lengthSq() < r * r) {
                if (game.screen.switchColor) {
                    game.screen.switchColor(this.color);
                }
            }
        }
    },
    applyRotation: function(ring) {
        if (ring == this.rings[0] || ring == this.rings[1]) {
            this.apply();
        }
    }
};