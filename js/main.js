'use strict';

var game = game || {};

game.updateMouse = function(e) {
    this.mouse.x = e.pageX - e.target.offsetLeft;
    this.mouse.y = e.pageY - e.target.offsetTop;
};

// http://stackoverflow.com/questions/7301062/passing-variable-number-of-arguments-from-one-function-to-another
game.applyMethodList = function(list, method) {
    var args = Array.prototype.splice.call(arguments, 2);
    for (var index in list) {
        if (list[index][method]) {
            list[index][method].apply(list[index], args);
        }
    }
};

game.setScreen = function(screen) {
    this.mousemove = undefined;
    this.mousedown = undefined;
    this.mouseup = undefined;
    this.screen = screen;
    this.screen.setup();
};

game.setup = function() {
    this.canvas = document.querySelector('#canvas');
    this.canvasCtx = this.canvas.getContext('2d');
    this.mouse = game.math.Vector(0, 0);
    
    this.canvas.addEventListener('mousemove', function(e) {
        game.updateMouse(e);
        if (game.mousemove) {
            game.mousemove();
        }
    });
    
    this.canvas.addEventListener('mousedown',
    function(e) {
        if (game.mousedown) {
            game.mousedown();
        }
    });
    
    this.canvas.addEventListener('mouseup', function(e) {
        if (game.mouseup) {
            game.mouseup();
        }
    });
    
    this.images.load('wheel');
    this.images.load('switch');
    
    this.setScreen(this.titleScreen);
    this.update();
};
window.addEventListener('load', game.setup.bind(game));

game.update = function() {
    requestAnimationFrame(this.update.bind(this));
    this.screen.update();
    
    this.canvasCtx.fillStyle = 'black';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.screen.draw(this.canvasCtx);
};