'use strict';

var game = game || {};

game.levels = {
    getRunesPerRing: function(level) {
        return game.value.LEVEL_RUNES[Math.floor((level + 4) / 10)];
    },
    getSwitchPattern: function(level) {
        if (level == 1) return game.value.LEVEL_SWITCHES[0];
        else return game.value.LEVEL_SWITCHES[((level - 2) % 10) + 1]
    },
    getAutoSwitchCount: function(level) {
        return Math.floor((level - 2) / 10);
    }
};