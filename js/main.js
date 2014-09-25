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

// Initializes the game's data
game.setup = function() {

    // Get needed data
    this.canvas = document.querySelector('#canvas');
    this.canvasCtx = this.canvas.getContext('2d');
    this.mouse = game.math.Vector(0, 0);
    
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
        if (game.mousedown) {
            game.mousedown();
        }
    });
    
    // Listen for mouse up events
    this.canvas.addEventListener('mouseup', function(e) {
        if (game.mouseup) {
            game.mouseup();
        }
    });
    
    // Start loading images
    this.images.load('wheel');
    this.images.load('switch');
    
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
    
    // Draw the screen
    this.screen.draw(this.canvasCtx);
};