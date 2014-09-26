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
        '#ff0',
        '#0f0',
        '#0ff',
        '#f80',
        '#08f',
        
        // unused
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
    
    // Colors for the buttons in the level select screen
    LEVEL_COLORS: [
        '#080',
        '#082',
        '#084',
        '#086',
        '#088',
        '#068',
        '#048',
        '#028',
        '#008',
        '#208',
        '#408',
        '#608',
        '#808',
        '#806',
        '#804',
        '#802',
        '#800',
        '#600',
        '#400',
        '#200',
    ],
    
    // Text for various levels
    LEVEL_TEXT: {
        1: ['Drag rings to', 'rotate them.', 'Align colors to', 'clear the level.'],
        6: ['Click switches', 'to swap runes', 'between rings.'],
        16: ['Switches with', 'the same color', 'activate at', 'the same time.'],
        56: ['Black switches', 'automatically', 'switch passing', 'runes.']
    },
    
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