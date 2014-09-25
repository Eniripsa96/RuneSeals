'use strict';

// The global game object containing everything
var game = game || {};

// Some math helper methods for the game
game.math = {
    
    // Squares a single number
    sq: function(x) {
        return x * x;
    },

    // A vector class with some helpful methods
    Vector: function(x, y) {
        return {
        
            // Fields
            x: x,
            y: y,
            
            // Methods
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
    
    // Methods for the vector object
    vectorMethods: {
    
        // Calculates the dot product between two vectors
        dot: function(vector) {
            return this.x * vector.x + this.y * vector.y;
        },
        
        // Adds two vectors together and returns the result as a new vector
        add: function(vector) {
            return game.math.Vector(this.x + vector.x, this.y + vector.y);
        },
        
        // Subtracts two vectors and returns the result as a new vector
        sub: function(vector) {
            return game.math.Vector(this.x - vector.x, this.y - vector.y);
        },
        
        // Multiples the vector by scalars, modifying it
        mul: function(x, y) {
            return game.math.Vector(this.x * x, this.y * y);
        },
        
        // Calculates the squared length of the vector
        lengthSq: function() {
            return this.dot(this);
        },
        
        // Calculates the length of the vector
        length: function() {
            this.length = this.length || Math.sqrt(this.lengthSq());
            return this.length;
        },
        
        // Rotates the vector with the cosine and sine of the rotation angle
        rotate: function(cos, sin) {
            var t = this.x * cos - this.y * sin;
            this.y = this.x * sin + this.y * cos;
            this.x = t;
        },
        
        // Clones the vector, returning a new one with the same values
        clone: function() {
            return game.math.Vector(this.x, this.y);
        },
        
        // Returns a new vector that is normal to the current one
        normal: function() {
            return game.math.Vector(-this.y, this.x);
        }
    }
};