'use strict';

// The global game object containing everything
var game = game || {};

// The manager for images used by the game
game.images = {

    // Fields
    table: {},
    counter: 0,
    
    // Checks whether or not all images are loaded
    isReady: function() {
        return this.counter == 0;
    },
    
    // Retrieves an image by name
    get: function(name) {
        return this.table[name];
    },
    
    // Loads an image by name
    load: function(name) {
    
        // Don't load already loaded images
        if (name in this.table)
        {
            return;
        }
        
        // Starts loading the image and keeps track of how many are loading
        this.counter++;
        var img = new Image();
        img.onload = this.onImgLoaded.bind(this);
        img.src = 'img/' + name + '.png';
        this.table[name] = img;
    },
    
    // Updates the number of images that are loading when one finishes
    onImgLoaded: function() {
        this.counter--;
    }
};