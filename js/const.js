'use strict';

// The global game object containing everything
var game = game || {};

// A few constants for the game
game.value = {

    // Sin/Cos values for rotating rings
    ROTATION_COS: Math.cos(Math.PI / 90),
    ROTATION_SIN: Math.sin(Math.PI / 90),
    
    // Available colors for runes
    RUNE_COLORS: [
        '#f00',
        '#f80',
        '#ff0',
        '#0f0',
        '#0ff',
        '#08f',
        '#00f',
        '#80f',
        '#f0f',
        '#f08'
    ],
    
    // Available colors for switches
    SWITCH_COLORS: [
        '#800',
        '#080',
        '#008'
    ],
    
    // Manual switch layouts for levels
    LEVEL_SWITCHES: [
        [],
        [1],
        [1, 1],
        [2],
        [2, 1],
        [2, 1],
        [2, 1, 1],
        [2, 2],
        [3, 2],
        [3, 2, 1],
        [3, 2, 2]
    ],
    
    // The number of runes per ring for levels
    LEVEL_RUNES: [4, 5, 6, 8, 9, 10]
};