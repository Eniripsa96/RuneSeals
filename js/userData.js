'use strict';

// The global game object containing everything
var game = game || {};

// The helper for getting/saving user data
game.userData = {
    
	// Whether or not the storage is enabled
    enabled: typeof(Storage) !== 'undefined',
    
	// Sets a value to the local storage if enabled
    set: function(key, value) {
        if (this.enabled) {
            localStorage.setItem(key, value);
        }
    },
	
	// Gets a value from the local storage if enabled
    get: function(key) {
        if (this.enabled) {
            return localStorage[key];
        }
    },
	
	// Gets a number value from the local storage if enabled
    getNum: function(key) {
        if (this.enabled && localStorage[key]) {
            return Number(localStorage[key]);
        }
        else return 0;
    }
};