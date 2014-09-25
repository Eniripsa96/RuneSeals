'use strict';

var game = game || {};

game.images = {
    table: {},
    counter: 0,
    isReady: function() {
        return this.counter == 0;
    },
    get: function(name) {
        return this.table[name];
    },
    load: function(name) {
        if (name in this.table)
        {
            return;
        }
        
        this.counter++;
        var img = new Image();
        img.onload = this.onImgLoaded;
        img.src = 'img/' + name + '.png';
        this.table[name] = img;
    },
    onImgLoaded: function() {
        this.counter--;
    }
};