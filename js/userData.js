'use strict';

// The global game object containing everything
var game = game || {};

game.userData = {
    
    enabled: typeof(Storage) !== 'undefined',
    
    set: function(key, value) {
        if (this.enabled) {
            localStorage.setItem(key, value);
        }
    },
    get: function(key) {
        if (this.enabled) {
            return localStorage[key];
        }
    },
    getNum: function(key) {
        if (this.enabled && localStorage[key]) {
            return Number(localStorage[key]);
        }
        else return 0;
    }
};