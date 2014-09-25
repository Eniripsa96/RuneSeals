'use strict';

var game = game || {};

game.gameScreen = {
    wheels: undefined,
    colorSwitches: undefined,
    autoSwitches: undefined,
    level: undefined,
    setup: function() {
        this.generate();
        game.mouseup = this.applyMouseUp.bind(this);
        game.mousedown = this.applyMouseDown.bind(this);
    },
    generate: function() {
        this.wheel = undefined;
        this.colorSwitches = {};
        this.autoSwitches = [];
        
        this.wheel = game.Wheel(this.level, game.levels.getRunesPerRing(this.level));
        this.wheel.generate();
        
        var used = new Array(this.wheel.runesPerRing * 2);
        var colorPattern = game.levels.getSwitchPattern(this.level);
        for (var colorIndex in colorPattern) {
            var color = game.value.SWITCH_COLORS[colorIndex];
            this.colorSwitches[color] = [];
            for (var i = 0; i < colorPattern[colorIndex]; i++) {
                this.colorSwitches[color].push(this.createSwitch(used, color));
            }
        }
        
        var autoSwitchCount = game.levels.getAutoSwitchCount(this.level);
        for (var j = 0; j < autoSwitchCount; j++) {
            this.autoSwitches.push(this.createSwitch(used));
        }
        
        var m = (this.level == 1) ? 6 : 8;
        for (var i = 0; i < this.level * this.wheel.runesPerRing + 1; i++) {
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
    createSwitch: function(used, color) {
        var index, listId;
        do {
            index = Math.floor(Math.random() * this.wheel.runesPerRing);
            listId = Math.floor(Math.random() * 2);
        }
        while (used[listId * this.wheel.runesPerRing + index]);
        
        used[listId * this.wheel.runesPerRing + index] = true;
        return game.Switch(
            this.wheel.rings[listId],
            index,
            this.wheel.rings[listId + 1],
            index,
            color
        );
    },
    update: function() {
        this.wheel.update();
    },
    draw: function(ctx) {
        this.wheel.draw(ctx);
        for (var color in this.colorSwitches) {
            game.applyMethodList(this.colorSwitches[color], 'draw', ctx);
        }
        game.applyMethodList(this.autoSwitches, 'draw', ctx);
    },
    switchColor: function(color) {
        if (this.colorSwitches[color]) {
            var list = this.colorSwitches[color];
            for (var index in list) {
                list[index].apply();
            }
        }
    },
    switchAuto: function(ring) {
        for (var index in this.autoSwitches) {
            this.autoSwitches[index].applyRotation(ring);
        }
    },
    applyMouseUp: function() {
        for (var color in this.colorSwitches) {
            game.applyMethodList(this.colorSwitches[color], 'applyClick');
        }
        game.applyMethodList(this.wheel.rings, 'applyMouseUp');
    },
    applyMouseDown: function() {
        game.applyMethodList(this.wheel.rings, 'applyMouseDown');
    }
};