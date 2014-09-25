'use strict';

var game = game || {};

game.math = {

    sq: function(x) {
        return x * x;
    },

    Vector: function(x, y) {
        return {
            x: x,
            y: y,
            dot: this.vectorMethods.dot,
            add: this.vectorMethods.add,
            sub: this.vectorMethods.sub,
            mul: this.vectorMethods.mul,
            lengthSq: this.vectorMethods.lengthSq,
            length: this.vectorMethods.length,
            rotate: this.vectorMethods.rotate,
            clone: this.vectorMethods.clone,
            normal: this.vectorMethods.normal
        }
    },
    
    vectorMethods: {
        dot: function(vector) {
            return this.x * vector.x + this.y * vector.y;
        },
        add: function(vector) {
            return game.math.Vector(this.x + vector.x, this.y + vector.y);
        },
        sub: function(vector) {
            return game.math.Vector(this.x - vector.x, this.y - vector.y);
        },
        mul: function(x, y) {
            return game.math.Vector(this.x * x, this.y * y);
        },
        lengthSq: function() {
            return this.dot(this);
        },
        length: function() {
            this.length = this.length || Math.sqrt(this.lengthSq());
            return this.length;
        },
        rotate: function(cos, sin) {
            var t = this.x * cos - this.y * sin;
            this.y = this.x * sin + this.y * cos;
            this.x = t;
        },
        clone: function() {
            return game.math.Vector(this.x, this.y);
        },
        normal: function() {
            return game.math.Vector(-this.y, this.x);
        }
    }
};