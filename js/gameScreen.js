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
    startTime: undefined,
    time: undefined,
    text: undefined,
    moves: [],
    best: undefined,
    
    // Sets up the screen, initializing a level and
    // setting up mouse event handlers
    setup: function() {
        this.generate();
        this.background = game.images.get('gameBackground');
        game.mouseup = this.applyMouseUp.bind(this);
        game.mouseout = this.applyMouseOut.bind(this);
        game.mousedown = this.applyMouseDown.bind(this);
        game.rightclick = this.undo.bind(this);
    },
    
    // Generates a new wheel using the screen's current level
    generate: function() {
    
        // Get the best time for this level
        this.best = game.userData.getNum('level' + this.level);
    
        // Clear any previous data
        this.wheel = undefined;
        this.colorSwitches = {};
        this.autoSwitches = [];
        
        // Initialize a new wheel
        this.wheel = game.Wheel(this.level, game.levels.getRunesPerRing(this.level));
        this.wheel.generate();
        
        // Add some manual color switches
		var rings = [0, 1];
        var used = new Array(this.wheel.runesPerRing * 2);
        var colorPattern = game.levels.getSwitchPattern(this.level);
        for (var colorIndex in colorPattern) {
            var color = game.value.SWITCH_COLORS[colorIndex];
            this.colorSwitches[color] = [];
            for (var i = 0; i < colorPattern[colorIndex]; i++) {
                this.colorSwitches[color].push(this.createSwitch(used, rings, color));
            }
        }
        
        // Add some automatic switches
        var autoSwitchCount = game.levels.getAutoSwitchCount(this.level);
        for (var j = 0; j < autoSwitchCount; j++) {
            this.autoSwitches.push(this.createSwitch(used, rings));
        }
        
        // Shuffle the wheel
        var m = (this.level == 1) ? 6 : 8;
        var last = [];
        for (var i = 0; i < 2 * this.level * this.wheel.runesPerRing + 1; i ++) {
            var rand, mod, div;
            do {
                rand = Math.random() * m;
                mod = rand % 2;
                div = Math.floor(rand / 2);
            }
            while ((last[3] >= 6 && rand >= 6) || (rand < 6 && last[div] !== undefined && mod < 1 == last[div] < 1));
            last[3] = rand;
            
            if (rand < 6) {
                this.wheel.rings[div].shift(mod < 1);
			}
			else {
                var c = Math.floor(Math.random() * colorPattern.length);
                this.switchColor(game.value.SWITCH_COLORS[c]);
                last[0] = last[1] = last[2] = undefined;
                console.log('Switched: ' + game.value.SWITCH_COLORS[c]);
            }
        }
        
        // Redo the randomization if the shuffle resulted in a solved puzzle
        if (this.wheel.isSolved()) {
            this.generate();
            return;
        }
        
        // Start the timer
        this.startTime = new Date().getTime();
        
        // Get the level text
        this.text = game.value.LEVEL_TEXT[this.level];
    },
    
    // Creates a new switch of the given color without overlapping
    // other switches as recorded in the used array
    createSwitch: function(used, rings, color) {
    
        // Get an open spot
        var index, listId, ringIndex;
        do {
            index = Math.floor(Math.random() * this.wheel.runesPerRing);
			if (rings.length > 0) {
				ringIndex = Math.floor(Math.random() * rings.length);
				listId = rings[ringIndex];
			}
            else {
				listId = Math.floor(Math.random() * 2);
			}
        }
        while (used[listId * this.wheel.runesPerRing + index]);
		if (ringIndex !== undefined) {
			rings.splice(ringIndex, 1);
		}
        
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
        this.time = new Date().getTime();
    },
    
    // Draws the game screen, rendering the wheel and switches
    draw: function(ctx) {
    
        // Draw the wheel and its components
        this.wheel.draw(ctx);
        for (var color in this.colorSwitches) {
            game.applyMethodList(this.colorSwitches[color], 'draw', ctx);
        }
        game.applyMethodList(this.autoSwitches, 'draw', ctx);
        
        // Draw the level data box
        ctx.strokeStyle = '#aaa';
        ctx.fillStyle = '#aaa';
        var x = ctx.canvas.width * 0.02;
        var y = ctx.canvas.height * 0.03;
        var w = ctx.canvas.width * 0.2;
        var h = ctx.canvas.height * 0.2;
        var r = ctx.canvas.height * 0.02;
        ctx.lineWidth = r / 3;
        game.drawing.rect(ctx, x, y, w, h, r);
        ctx.stroke();
        
        // Current level
        ctx.font = ctx.canvas.height * 0.06 + 'px "Bree Serif"';
        var text = 'Level ' + this.level;
        var size = ctx.measureText(text);
        ctx.fillText(text, ctx.canvas.width * 0.12 - size.width / 2, ctx.canvas.height * 0.08);
        
        // Current time
        var seconds = Math.floor((this.time - this.startTime) / 1000);
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        text = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        size = ctx.measureText(text);
        ctx.fillText(text, ctx.canvas.width * 0.12 - size.width / 2, ctx.canvas.height * 0.16);
        
        // Draw the best time data box
        var x = ctx.canvas.width * 0.78;
        game.drawing.rect(ctx, x, y, w, h, r);
        ctx.stroke();
        
        // Best label
        text = 'Best Time';
        size = ctx.measureText(text);
        ctx.fillText(text, ctx.canvas.width * 0.88 - size.width / 2, ctx.canvas.height * 0.08);
        
        // Best time
        if (this.best > 0) {
            seconds = this.best % 60;
            minutes = Math.floor(this.best / 60);
            text = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }
        else {
            text = 'None';
        }
        size = ctx.measureText(text);
        ctx.fillText(text, ctx.canvas.width * 0.88 - size.width / 2, ctx.canvas.height * 0.16);
        
        // Level text
        if (this.text) {
        
            x = ctx.canvas.width * 0.02;
            y = ctx.canvas.height * 0.78;
            game.drawing.rect(ctx, x, y, w, h, r);
            ctx.stroke();
        
            var lines = this.text.length;
            var y = game.canvas.height * (0.88 - 0.02 * (lines - 1));
            ctx.font = ctx.canvas.height * 0.04 + 'px "Bree Serif"';
            var i, maxWidth = 0;
            for (i = 0; i < lines; i++) {
                size = ctx.measureText(this.text[i]);
                if (size.width > maxWidth) {
                    maxWidth = size.width;
                }
            }
            var textX = game.canvas.width * 0.12 - maxWidth / 2;
            for (i = 0; i < lines; i++) {
                ctx.fillText(this.text[i], textX, y);
                y += game.canvas.height * 0.04;
            }
        }
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
    
    // Undoes the last move
    undo: function() {
        if (this.moves.length > 0) {
            var move = this.moves.pop();
            
            // Undo a rotation
            if (move.rotation) {
                move.ring.unshift(move.clockwise);
            }
            
            // Undo a switch
            else {
                this.switchColor(move.color);
            }
        }
    },
    
    // Checks whether or not the level has been cleared
    checkVictory: function() {
        if (this.wheel.isSolved()) {
        
            // Update progress
            var best = game.userData.getNum('level');
            if (this.level > best) {
                game.userData.set('level', this.level);
            }
            
            // Update time
            var seconds = Math.max(1, Math.floor((this.time - this.startTime) / 1000));
            if (seconds < this.best || this.best == 0) {
                game.userData.set('level' + this.level, seconds);
            }
            
            // Move to the next level
			game.setScreen(game.winScreen);
        }
    },
    
    // Handles mouse up events for the screen, activating
    // switches and cancelling dragging rings
    applyMouseUp: function() {
        for (var color in this.colorSwitches) {
            game.applyMethodList(this.colorSwitches[color], 'applyClick');
        }
        this.applyMouseOut();
    },
    
    // Handles mouse down events for the screen, starting
    // dragging rings around
    applyMouseDown: function() {
        game.applyMethodList(this.wheel.rings, 'applyMouseDown');
    },
    
    // Handles mouse out events for the screen, cancelling dragging rings
    applyMouseOut: function() {
        game.applyMethodList(this.wheel.rings, 'applyMouseUp');
    }
};