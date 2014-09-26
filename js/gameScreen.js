'use strict';

// The global game object containing everything
var game = game || {};

// The screen for playing the game
game.gameScreen = {

    // Fields
    wheels: undefined,
    colorSwitches: undefined,
    autoSwitches: undefined,
    level: undefined,
    
    // Sets up the screen, initializing a level and
    // setting up mouse event handlers
    setup: function() {
        this.generate();
        game.mouseup = this.applyMouseUp.bind(this);
        game.mousedown = this.applyMouseDown.bind(this);
    },
    
    // Generates a new wheel using the screen's current level
    generate: function() {
    
        // Clear any previous data
        this.wheel = undefined;
        this.colorSwitches = {};
        this.autoSwitches = [];
        
        // Initialize a new wheel
        this.wheel = game.Wheel(this.level, game.levels.getRunesPerRing(this.level));
        this.wheel.generate();
        
        // Add some manual color switches
        var used = new Array(this.wheel.runesPerRing * 2);
        var colorPattern = game.levels.getSwitchPattern(this.level);
        for (var colorIndex in colorPattern) {
            var color = game.value.SWITCH_COLORS[colorIndex];
            this.colorSwitches[color] = [];
            for (var i = 0; i < colorPattern[colorIndex]; i++) {
                this.colorSwitches[color].push(this.createSwitch(used, color));
            }
        }
        
        // Add some automatic switches
        var autoSwitchCount = game.levels.getAutoSwitchCount(this.level);
        for (var j = 0; j < autoSwitchCount; j++) {
            this.autoSwitches.push(this.createSwitch(used));
        }
        
        // Shuffle the wheel
        var m = (this.level == 1) ? 6 : 8;
        for (var i = 0; i < 2 * this.level * this.wheel.runesPerRing + 1; i++) {
            var rand = Math.random() * m;
            
            if (rand < 6) {
				this.wheel.rings[Math.floor(rand / 2)].shift(rand < 5);
			}
			else {
                var c = Math.floor(Math.random() * colorPattern.length);
                this.switchColor(game.value.SWITCH_COLORS[c]);
                console.log('Switched: ' + game.value.SWITCH_COLORS[c]);
            }
        }
    },
    
    // Creates a new switch of the given color without overlapping
    // other switches as recorded in the used array
    createSwitch: function(used, color) {
    
        // Get an open spot
        var index, listId;
        do {
            index = Math.floor(Math.random() * this.wheel.runesPerRing);
            listId = Math.floor(Math.random() * 2);
        }
        while (used[listId * this.wheel.runesPerRing + index]);
        
        // Mark it as used
        used[listId * this.wheel.runesPerRing + index] = true;
        
        // Create and return a new switch in the spot
        return game.Switch(
            this.wheel.rings[listId],
            index,
            this.wheel.rings[listId + 1],
            index,
            color
        );
    },
    
    // Updates the screen by updating the wheel
    update: function() {
        this.wheel.update();
    },
    
    // Draws the game screen, rendering the wheel and switches
    draw: function(ctx) {
        this.wheel.draw(ctx);
        for (var color in this.colorSwitches) {
            game.applyMethodList(this.colorSwitches[color], 'draw', ctx);
        }
        game.applyMethodList(this.autoSwitches, 'draw', ctx);
    },
    
    // Toggles manual switches of the given color
    switchColor: function(color) {
        if (this.colorSwitches[color]) {
            var list = this.colorSwitches[color];
            for (var index in list) {
                list[index].apply();
            }
        }
    },
    
    // Toggles automatic switches next to the given ring
    switchAuto: function(ring) {
        for (var index in this.autoSwitches) {
            this.autoSwitches[index].applyRotation(ring);
        }
    },
    
    // Checks whether or not the level has been cleared
    checkVictory: function() {
        if (this.wheel.isSolved()) {
        
            // Update best progress
            var best = game.userData.getNum('level');
            if (this.level > best) {
                game.userData.set('level', this.level);
            }
            
            // Move to the next level
            this.level++;
            this.generate();
        }
    },
    
    // Handles mouse up events for the screen, activating
    // switches and canceling dragging rings
    applyMouseUp: function() {
        for (var color in this.colorSwitches) {
            game.applyMethodList(this.colorSwitches[color], 'applyClick');
        }
        game.applyMethodList(this.wheel.rings, 'applyMouseUp');
    },
    
    // Handles mouse down events for the screen, starting
    // dragging rings around
    applyMouseDown: function() {
        game.applyMethodList(this.wheel.rings, 'applyMouseDown');
    }
};