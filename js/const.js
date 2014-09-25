'use strict';

var game = game || {};

game.value = {
    ROTATION_COS: Math.cos(Math.PI / 90),
    ROTATION_SIN: Math.sin(Math.PI / 90),
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
    SWITCH_COLORS: [
        '#800',
        '#080',
        '#008'
    ],
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
    LEVEL_RUNES: [4, 5, 6, 8, 9, 10]
};