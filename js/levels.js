'use strict';

// The global game object containing everything
var game = game || {};

// Methods for determining data for levels
game.levels = {

    // Retrieves the number of runes per ring for a level
    getRunesPerRing: function(level) {
        level = Math.floor((level + 4) / 5);
        return game.value.LEVEL_RUNES[Math.floor((level + 4) / 10)];
    },
    
    // Retrieves the manual switch pattern for a level
    getSwitchPattern: function(level) {
        if (level >= 3 && level <= 5) return [1];
        level = Math.floor((level + 4) / 5);
        if (level == 1) return game.value.LEVEL_SWITCHES[0];
        else return game.value.LEVEL_SWITCHES[((level - 2) % 10) + 1]
    },
    
    // Retrieves the number of automatic switches for a level
    getAutoSwitchCount: function(level) {
        level = Math.floor((level + 4) / 5);
        return Math.floor((level - 2) / 10);
    }
};