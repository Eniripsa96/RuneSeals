'use strict';

// The global game object containing everything
var game = game || {};

// Updates the game's mouse object according to a mouse event
game.updateMouse = function(e) {
    this.mouse.x = e.pageX - e.target.offsetLeft;
    this.mouse.y = e.pageY - e.target.offsetTop;
};

// Calls a method for a list of objects using optional parameters
// Optional parameters code is from this thread:
// http://stackoverflow.com/questions/7301062/passing-variable-number-of-arguments-from-one-function-to-another
game.applyMethodList = function(list, method) {
    var args = Array.prototype.splice.call(arguments, 2);
    for (var index in list) {
        if (list[index][method]) {
            list[index][method].apply(list[index], args);
        }
    }
};

// Sets the active screen of the game, clearing
// any event handlers of the previous screen and setting
// up those for the new one
game.setScreen = function(screen) {
    this.mousemove = undefined;
    this.mousedown = undefined;
    this.mouseup = undefined;
    this.screen = screen;
    this.screen.setup();
};

// Music for the game
game.activeSong = undefined;
game.music = {
    menu: new Audio("sound/runeOpening.mp3")
};

// Initializes the game's data
game.setup = function() {

    // Get needed data
    this.canvas = document.querySelector('#canvas');
    this.canvasCtx = this.canvas.getContext('2d');
    this.mouse = game.math.Vector(0, 0);
    
    // Set music to loop and start off mute
    for (var song in this.music) {
        this.music[song].loop = true;
        this.music[song].volume = 0;
    }
    
    // Listen for mouse move events
    this.canvas.addEventListener('mousemove', function(e) {
        game.updateMouse(e);
        if (game.mousemove) {
            game.mousemove();
        }
    });
    
    // List for mouse down events
    this.canvas.addEventListener('mousedown',
    function(e) {
        if (game.mousedown && e.button == 0) {
            game.mousedown();
        }
    });
    
    // Listen for mouse up events
    this.canvas.addEventListener('mouseup', function(e) {
        if (game.mouseup && e.button == 0) {
            game.mouseup();
        }
        else if (game.rightclick && e.button == 2) {
            game.rightclick();
        }
    });
    
    // Cancel the context menu
    this.canvas.oncontextmenu = function(e) {
        return false;
    };
    
    // Apply mouse out event
    this.canvas.addEventListener('mouseout', function(e) {
        game.mouse.x = -1;
        game.mouse.y = -1;
        if (game.mouseout) {
            game.mouseout();
        }
    });
    
    // Start loading images
    this.images.load('switch');
    this.images.load('wheel');
    this.images.load('center');
    var i;
    for (i = 1; i <= 4; i++) {
        this.images.load('titleImage' + i);
    }
    for (i = 0; i < this.value.ROCK_COUNT; i++) {
        this.images.load('rock' + i);
    }    
    for (i = 0; i < this.value.DEBRIS_COUNT; i++) {
        this.images.load('debris' + i);
    }
    for (i = 0; i < 6; i++) {
        this.images.load('rune' + i);
    }
    
    // Set the initial screen
    this.setScreen(this.titleScreen);
    this.update();
};
window.addEventListener('load', game.setup.bind(game));

// The game update loop
game.update = function() {
    requestAnimationFrame(this.update.bind(this));
    
    // Update the screen
    this.screen.update();
    
    // Clear the canvas
    this.canvasCtx.fillStyle = 'black';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update music
    if (this.activeSong != this.screen.song) {
        if (this.activeSong !== undefined) {
            this.music[this.activeSong].volume = Math.max(0, this.music[this.activeSong].volume - 0.01);
            if (this.music[this.activeSong].volume == 0) {
                this.music[this.activeSong].pause();
            }
        }
        if (this.activeSong === undefined || this.music[this.activeSong].volume <= 0) {
            this.activeSong = this.screen.song;
            if (this.activeSong !== undefined) {
                this.music[this.activeSong].play();
            }
        }
    }
    if (this.activeSong === this.screen.song && this.activeSong !== undefined && this.music[this.activeSong].volume < 1) {
        this.music[this.activeSong].volume = Math.min(1, this.music[this.activeSong].volume + 0.01);
    }
    
    // Draw the screen
    this.screen.draw(this.canvasCtx);
};