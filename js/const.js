'use strict';

// The global game object containing everything
var game = game || {};

// A few constants for the game
game.value = {

    // Sin/Cos values for rotating rings
    ROTATION_COS: Math.cos(Math.PI / 90),
    ROTATION_SIN: Math.sin(Math.PI / 90),
    
    // Debris math constants
    GEM_ROCK_ANGLES: [45, 30, 20],
    DEBRIS_ANGLES: [15, 10, 7],
    
    // Number of rock sprites
    ROCK_COUNT: 6,
    DEBRIS_COUNT: 6,
    
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
        2: ['Faded rings', 'are disabled', "and you can't", 'rotate them.'],
        3: ['Click switches', 'to swap runes', 'between rings.'],
        4: ['You can right', 'click to undo', 'any number', 'of moves.'],
        5: ['This is the last', 'level before', 'it gets harder.', 'Good luck.'],
        16: ['Switches with', 'the same color', 'activate at', 'the same time.'],
        56: ['Black switches', 'automatically', 'switch passing', 'runes.']
    },
    
    // Manual switch layouts for levels
    LEVEL_SWITCHES: [
        [],
        [1],
        [1, 1],
        [2, 1],
        [2],
        [2, 2],
        [3],
        [3, 2],
        [3, 3],
        [4],
        [5]
    ],
    
    // The number of runes per ring for levels
    LEVEL_RUNES: [4, 5, 6, 8, 9, 10]
};