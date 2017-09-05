/* By Philipp Lenssen, bomomo.com */

var app = new App();
var misc = new MiscLibrary();
window.onload = init;

function init() {
    app.init();
    app.intervalID = setInterval(run, app.intervalMS);
}

function run() {
    app.handleRageMode();
    for (var i in app.sprites) {
        app.sprites[i].move();
		var neighborIndex = i == 0 ? app.maxSprites - 1 : i - 1;
        app.sprites[i].handleType(app.sprites[neighborIndex], i, app.sprites[0]);
    }
    app.draw();
}

function handleMouseMoved(e) {
    var x = 0, y = 0;
    if (!e) var e = window.event;
    if (e.layerX) {
        x = e.layerX;
        y = e.layerY;
    }
    else {
        x = e.x;
        y = e.y;
    }
    if (x && y) {
        app.lastCursorX = app.cursorX;
        app.lastCursorY = app.cursorY;
        app.cursorX = x;
        app.cursorY = y;
    }
}

function handleMouseDown(e) {
    app.cursorActive = true;
    for (var i in app.sprites) {
        app.sprites[i].initedAfterCursorActive = false;
    }
}

function handleMouseUp(e) {
    app.cursorActive = false;
    if (app.timeout == 0) {
        app.timeout = setTimeout('switchSubmode()', 300);
    }
    for (var i in app.sprites) {
        app.sprites[i].initedAfterCursorInactive = false;
    }
}

function switchSubmode() {
    app.submode = app.submode == 1 ? 2 : 1;
    app.timeout = 0;
}

function handleMouseIn(e) {
    app.cursorIn = true;
}

function handleMouseOut(e) {
    app.cursorIn = false;
    app.cursorActive = false;
}

/**** App follows ****/

function App() {
    var i = 1;

    this.pressed = false;
    this.cursorX = 0;
    this.cursorY = 0;
    this.lastCursorX = 0;
    this.lastCursorY = 0;
    this.cursorIn = false;
    this.cursorActive = false;
    this.intervalMS = 10; // 40;
    this.intervalID = null;
    this.sprites = new Array();
    this.fullCircle = Math.PI * 2;
    this.canvasWidth = 1500;
    this.canvasHeight = 2500;
	//this.canvasWidth = document.getElementById('canvasBackground').offsetWidth;
	//this.canvasHeight = document.getElementById('canvasBackground').offsetHeight;
    this.canvasBackground = null;
    this.canvasBackgroundContext = null;
    this.canvasForeground = null;
    this.canvasForegroundContext = null;
    this.maxSprites = 5;
    this.submode = 1;
    this.timeout = 0;
    this.menuTimeout = 0;
    this.colors = new Array();
    this.canCanvas = false;
    //this.hasSaveTypes = false;

    this.rageMode = false;
    this.rageAmount = 0;
    this.rageModeCounter = 0;
    this.rageModeJustActivated = false;
    this.rageModeJustInactivated = false;

    this.enumHunter = i++;
    this.enumBouncer = i++;
    this.enumEraser = i++;
    this.enumRobot = i++;
    this.enumCircleHunter = i++;
    this.enumCircle = i++;
    this.enumCrosshatch = i++;
    this.enumBubble = i++;
    this.enumCurve = i++;
    this.enumComet = i++;
    this.enumPendulum = i++;
    this.enumLines = i++;
    this.enumGrid = i++;
    this.enumSpray = i++;
    this.enumLineSpray = i++;
    this.enumMatrix = i++;
    this.enumFollower = i++;
    this.enumRectangler = i++;
    this.enumSprinkler = i++;
    this.enumShaper = i++;

    this.maxSpriteTypes = i - 1;

    this.indexRed = 0;
    this.indexGreen = 1;
    this.indexBlue = 2;
    this.paletteMax = 256;

    this.type = 1;

    this.enumDrawInk = i++;
    this.enumShow = i++;

    this.teleported = false;
}

App.prototype.init = function() {
    var isIE = navigator.appName.indexOf('Microsoft') != -1;
    app.canCanvas = !isIE;
    app.type = 12;
    this.initCanvas();
    this.initColors();
    this.initSprites();
}


App.prototype.resetSprites = function() {
    app.sprites = new Array();
    app.initSprites();
}

App.prototype.initSprites = function() {
    for (i = 0; i < app.maxSprites; i++) {
        this.sprites[i] = new Sprite();
        this.sprites[i].type = app.type;
    }
}

App.prototype.inCanvasWithPadding = function(x, y) {
    var padding = 30;
    return x >= padding && x <= this.canvasWidth - padding && y >= padding && y <= this.canvasHeight - padding;
}

App.prototype.draw = function() {
    this.canvasForegroundContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (var i in this.sprites) {
        var neighborIndex = i == 0 ? this.maxSprites - 1 : i - 1;
        this.sprites[i].draw(this.canvasBackgroundContext, this.enumDrawInk, this.sprites[neighborIndex], i);
        this.sprites[i].draw(this.canvasForegroundContext, this.enumShow, this.sprites[neighborIndex], i);
    }
    /// this.canvasForegroundContext.flush();
}

App.prototype.handleRageMode = function() {
    var rageReachedAt = 200;
    var rageMax = 2000;
    var antiRage = 15;
    var rageCounterStart = 400;

    this.rageModeJustActivated = false;
    this.rageModeJustInactivated = false;

    if (app.cursorIn) {
        if ( app.inCanvasWithPadding(this.lastCursorX, this.lastCursorY) && app.inCanvasWithPadding(this.cursorY, this.cursorY) ) {
            this.rageAmount += misc.getDistance(this.lastCursorX, this.lastCursorY, this.cursorX, this.cursorY);
        }
    }
    this.rageAmount -= antiRage;
    if (this.rageAmount < 0) {
        this.rageAmount = 0;
    }
    else if (this.rageAmount >= rageMax) {
        this.rageAmount = rageMax;
    }

    if (!this.rageMode && this.rageAmount >= rageReachedAt) {
        this.rageMode = true;
        this.rageModeCounter = rageCounterStart;
        this.rageAmount = 0;
        this.rageModeJustActivated = true;
    }

    if (this.rageMode) {
        this.rageAmount = 0;
        this.rageModeCounter--;
        if (this.rageModeCounter <= 0) {
            this.rageMode = false;
            this.rageModeJustInactivated = true;
        }
        // misc.debug('Rage mode!');
    }
    else {
        // misc.debug('[' + Math.floor(this.rageAmount) + ']');
    }
}

App.prototype.initColors = function() {
    var i = 0;
    var colorsMax = 15;
    for (i = 0; i < colorsMax; i++) {
        this.colors[i] = new Array();
    }

    i = 0;
    this.colors[i][this.indexRed] = 250; this.colors[i][this.indexGreen] = 0; this.colors[i][this.indexBlue] = 0; i++;
    this.colors[i][this.indexRed] = 250; this.colors[i][this.indexGreen] = 100; this.colors[i][this.indexBlue] = 0; i++;
    this.colors[i][this.indexRed] = 250; this.colors[i][this.indexGreen] = 250; this.colors[i][this.indexBlue] = 0; i++;
    this.colors[i][this.indexRed] = 0; this.colors[i][this.indexGreen] = 250; this.colors[i][this.indexBlue] = 0; i++;
    this.colors[i][this.indexRed] = 0; this.colors[i][this.indexGreen] = 150; this.colors[i][this.indexBlue] = 50; i++;
    this.colors[i][this.indexRed] = 0; this.colors[i][this.indexGreen] = 50; this.colors[i][this.indexBlue] = 150; i++;
    this.colors[i][this.indexRed] = 100; this.colors[i][this.indexGreen] = 150; this.colors[i][this.indexBlue] = 250; i++;
    this.colors[i][this.indexRed] = 0; this.colors[i][this.indexGreen] = 200; this.colors[i][this.indexBlue] = 250; i++;
    this.colors[i][this.indexRed] = 100; this.colors[i][this.indexGreen] = 50; this.colors[i][this.indexBlue] = 0; i++;
    this.colors[i][this.indexRed] = 150; this.colors[i][this.indexGreen] = 0; this.colors[i][this.indexBlue] = 200; i++;
    this.colors[i][this.indexRed] = 250; this.colors[i][this.indexGreen] = 50; this.colors[i][this.indexBlue] = 150; i++;
    this.colors[i][this.indexRed] = 250; this.colors[i][this.indexGreen] = 150; this.colors[i][this.indexBlue] = 150; i++;
    this.colors[i][this.indexRed] = 200; this.colors[i][this.indexGreen] = 150; this.colors[i][this.indexBlue] = 50; i++;
    this.colors[i][this.indexRed] = 200; this.colors[i][this.indexGreen] = 250; this.colors[i][this.indexBlue] = 100; i++;
    this.colors[i][this.indexRed] = 124; this.colors[i][this.indexGreen] = 124; this.colors[i][this.indexBlue] = 124; i++;
}

App.prototype.initCanvas = function() {
    this.canvasBackground = document.getElementById('canvasBackground');
    this.canvasBackgroundContext = this.canvasBackground.getContext('2d');

    this.canvasForeground = document.getElementById('canvasForeground');
    this.canvasForegroundContext = this.canvasForeground.getContext('2d');

    this.canvasBackground.width = this.canvasWidth;
    this.canvasBackground.height = this.canvasHeight;
    this.canvasForeground.width = this.canvasWidth;
    this.canvasForeground.height = this.canvasHeight;
    this.clearBack();
}

App.prototype.pendulum = function(centerX, centerY, radius, aoi, completionRatio) {
    // this function with thanks to PiXELWiT at
    // http://www.pixelwit.com/blog/2008/01/21/swing-pendulum-arc/

    var easedOneToNegOne = Math.cos(completionRatio * 2 * Math.PI);
    var aoiRadians = aoi * 2 * Math.PI;
    var currentRotation = easedOneToNegOne * aoiRadians;
    var x = centerX + Math.sin(currentRotation) * radius;
    var y = centerY + Math.cos(currentRotation) * radius;
    return {x:x, y:y};
}

App.prototype.mixColors = function(r1, g1, b1, r2, g2, b2, factor) {
    var colResult = new Array();
    var negative = (this.paletteMax - 1) - factor;

    colResult[this.indexRed] = Math.ceil( (r1 * factor + r2 * negative) / this.paletteMax );
    colResult[this.indexGreen] = Math.ceil( (g1 * factor + g2 * negative) / this.paletteMax );
    colResult[this.indexBlue] = Math.ceil( (b1 * factor + b2 * negative) / this.paletteMax );

    return colResult;
}

App.prototype.toGridX = function(v, gridSize) {
    if (!gridSize) { gridSize = 15; }
    if (v > 0 && v < this.canvasWidth) {
        v = Math.floor(v / gridSize) * gridSize;
    }
    return v;
}

App.prototype.toGridY = function(v, gridSize) {
    if (!gridSize) { gridSize = 15; }
    if (v > 0 && v < this.canvasHeight) {
        v = Math.floor(v / gridSize) * gridSize;
    }
    return v;
}

App.prototype.clearBack = function() {
    // this.canvasBackgroundContext.fillStyle = 'rgb(255,255,255)';
    // this.canvasBackgroundContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasBackgroundContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}


/**** Sprite follows ****/

function Sprite() {
    this.x = Math.floor( app.canvasWidth / 2 + misc.getRandomInt(-50, 50) );
    this.y = Math.floor( app.canvasHeight / 2 + misc.getRandomInt(-50, 50) );
    this.radius = 2;
    this.speedX = 0;
    this.speedY = 0;
    this.speedMaxX = 4;
    this.speedMaxY = this.speedMaxX;
    this.speedStep = .3;

    this.originX = this.x;
    this.originY = this.y;

    this.targetX = null;
    this.targetY = null;

    this.oldX = this.x;
    this.oldY = this.y;

    this.speedStepX = null;
    this.speedStepY = null;

    this.offset = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetXbase = 0;
    this.offsetYbase = 0;
    this.offsetRadius = 0;
    this.counter = 0;

    this.type = 0;
    this.energy = 0;
    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorDirection = 1;

    this.opacity = 0;
    this.maxOpacity = .8;
    this.opacityStep = .02;

    this.inited = false;
    this.initedAfterCursorActive = false;
    this.initedAfterCursorInactive = false;
}

Sprite.prototype.move = function() {

    if (this.speedX > this.speedMaxX) {
        this.speedX = this.speedMaxX;
    }
    else if (this.speedX < -this.speedMaxX) {
        this.speedX = -this.speedMaxX;
    }

    if (this.speedY > this.speedMaxY) {
        this.speedY = this.speedMaxY;
    }
    else if (this.speedY < -this.speedMaxY) {
        this.speedY = -this.speedMaxY;
    }

    this.oldX = this.x;
    this.oldY = this.y;
    this.x += this.speedX;
    this.y += this.speedY;
}

Sprite.prototype.followTarget = function() {
    if (this.targetX != null && this.targetY != null) {
        if (this.speedStepX == null) { this.speedStepX = this.speedStep; }
        if (this.speedStepY == null) { this.speedStepY = this.speedStep; }

        if (this.x > this.targetX) {
            this.speedX -= this.speedStepX;
        }
        else if (this.x < this.targetX) {
            this.speedX += this.speedStepX;
        }

        if (this.y > this.targetY) {
            this.speedY -= this.speedStepY;
        }
        else if (this.y < this.targetY) {
            this.speedY += this.speedStepY;
        }
    }
}

Sprite.prototype.handleType = function(neighbor, spriteCounter, leadSprite) {
    this.teleported = false;
    switch (this.type) {


        case app.enumCircleHunter:

            if (!this.inited) {
                this.x = Math.floor( app.canvasWidth / 2 + misc.getRandomInt(-150, 150) );
                this.y = Math.floor( app.canvasHeight / 2 + misc.getRandomInt(-150, 150) );
                this.speedX = misc.getRandomInt(-4, 4);
                this.speedY = misc.getRandomInt(-4, 4);
                this.speedMaxY = 3;
                this.speedMaxY = this.speedMaxX;
                this.speedStep = .3;
                this.radius = 5;
                this.maxOpacity = .2;
                this.opacityStep = .005;
            }

            var distance = ( this.getCursorDistance() + .01 );
            this.radius = 5 + ( 60 - misc.forceMax(distance, 60) );
            this.colorG = 200 + ( 55 - misc.forceMax(distance, 55) );
            if (distance <= 100 && app.cursorActive) {
                this.scrollRed();
                this.scrollBlue();
            }

            if (!this.initedAfterCursorActive) {
                this.colorR = 100 + misc.getRandomInt(0, 150);
                this.colorG = 200;
                this.colorB = misc.getRandomInt(0, 255);
            }

            if ( misc.chance(40) ) {
                this.follow(app.cursorX, app.cursorY);
            }

            this.keepInCanvas();
            this.adjustOpacityToCursor();
            this.followSimple(neighbor.x, neighbor.y);
            break;


        case app.enumLines:

            if (!this.inited) {
                this.x = Math.floor( app.canvasWidth / 2 + misc.getRandomInt(-150, 150) );
                this.y = Math.floor( app.canvasHeight / 2 + misc.getRandomInt(-150, 150) );
                this.speedX = misc.getRandomInt(-4, 4);
                this.speedY = misc.getRandomInt(-4, 4);
                this.radius = 5;
                this.speedMaxX = 6;
                this.speedMaxY = this.speedMaxX;
                this.speedStep = .3;
                this.colorR = misc.getRandomInt(40, 200);
                this.colorG = misc.getRandomInt(80, 255);
                this.colorB = misc.getRandomInt(0, 150);
                this.maxOpacity = .3;
            }

            if (spriteCounter == 0) {
                if (app.cursorIn) {
                    this.x = app.cursorX;
                    this.y = app.cursorY;
                }
                this.maxOpacity = 0;
            }
            else {
                this.followSimple(neighbor.x, neighbor.y);
            }

            if (app.rageModeJustActivated) {
                this.radius = 15;
                this.colorR = misc.getRandomInt(200, 255);
                this.colorG = misc.getRandomInt(200, 255);
                this.colorB = misc.getRandomInt(200, 255);
                this.maxOpacity = .6;
            }
            else if (app.rageModeJustInactivated) {
                this.radius = 5;
                this.colorR = misc.getRandomInt(40, 200);
                this.colorG = misc.getRandomInt(80, 255);
                this.colorB = misc.getRandomInt(0, 150);
                this.maxOpacity = .3;
            }

            this.keepInCanvasWithMargin(70); // 
            this.adjustOpacityToCursor();
            break;

    }

    this.inited = true;
    this.initedAfterCursorActive = true;
    this.initedAfterCursorInactive = true;
}

Sprite.prototype.setRGBFromOtherSprite = function(other, fuzziness) {
    this.colorR = other.colorR + misc.getRandomInt(-fuzziness, fuzziness);
    this.colorG = other.colorG + misc.getRandomInt(-fuzziness, fuzziness);
    this.colorB = other.colorB + misc.getRandomInt(-fuzziness, fuzziness);
}

Sprite.prototype.keepInCanvasByTeleport = function() {
    var margin = this.radius * 2;
    if (this.x > app.canvasWidth + margin) {
        this.x = -margin;
        this.teleported = true;
    }
    else if (this.x < -margin) {
        this.x = app.canvasWidth + margin / 2;
        this.teleported = true;
    }

    if (this.y > app.canvasHeight + margin) {
        this.y = -margin;
        this.teleported = true;
    }
    else if (this.y < -margin) {
        this.y = app.canvasHeight + margin / 2;
        this.teleported = true;
    }
}

Sprite.prototype.setCircleOffset = function() {
    var v = misc.getRandomInt(0, this.offsetRadius);
    var vOther = Math.floor(v / 2);
    if ( misc.getRandomInt(0, 1) == 1 ) {
        this.offsetX = misc.getRandomInt(-v, v);
        this.offsetY = misc.getRandomInt(-vOther, vOther);
    }
    else {
        this.offsetX = misc.getRandomInt(-vOther, vOther);
        this.offsetY = misc.getRandomInt(-v, v);
    }
}

Sprite.prototype.setColorFromPosition = function(x, y) {
    var width = app.canvasWidth, height = app.canvasHeight / 15;

    var i = y / height;
    i = Math.ceil(i) - 1;

    if (app.colors[i]) {
        var r = app.colors[i][app.indexRed];
        var g = app.colors[i][app.indexGreen];
        var b = app.colors[i][app.indexBlue];
    
        var colResult = new Array();
        if (x < width / 2) { // mix with black
            var length = (width / 2) - x;
            var percentBlack = (length / (width / 2) ) * 100;
            var factor = app.paletteMax - ( percentBlack * (app.paletteMax / 100) );
            colResult = app.mixColors(r, g, b, 0, 0, 0, factor);
        }
        else if (x > width / 2) { // mix with white
            var length = Math.abs( (width / 2) - x );
            var percentWhite = (length / (width / 2) ) * 100;
            var factor = app.paletteMax - ( percentWhite * (app.paletteMax / 100) );
            colResult = app.mixColors(r, g, b, app.paletteMax - 1, app.paletteMax - 1, app.paletteMax - 1, factor);
        }
        else {
            colResult[app.indexRed] = r;
            colResult[app.indexGreen] = g;
            colResult[app.indexBlue] = b;
        }
    
        this.colorR = colResult[app.indexRed];
        this.colorG = colResult[app.indexGreen];
        this.colorB = colResult[app.indexBlue];
    }
}

Sprite.prototype.crosshatch = function(limit) {
    if (this.speedX > 0 && this.speedY > 0) {
        this.offsetX += this.speedStep;
        this.offsetY += this.speedStep;
        if (this.offsetX > limit) {
            this.speedX *= -1;
            this.speedY *= -1;
        }
    }
    else if (this.speedX < 0 && this.speedY < 0) {
        this.offsetX -= this.speedStep;
        this.offsetY -= this.speedStep;
        if (this.offsetX < -limit) {
            this.speedX *= -1;
            this.speedY *= -1;
        }
    }
    else if (this.speedX < 0 && this.speedY > 0) {
        this.offsetX -= this.speedStep;
        this.offsetY += this.speedStep;
        if (this.offsetX < -limit) {
            this.speedX *= -1;
            this.speedY *= -1;
        }
    }
    else if (this.speedX > 0 && this.speedY < 0) {
        this.offsetX += this.speedStep;
        this.offsetY -= this.speedStep;
        if (this.offsetX > limit) {
            this.speedX *= -1;
            this.speedY *= -1;
        }
    }

    if ( misc.getRandomInt(0, 1000) <= 5 ) {
        this.offsetXbase = misc.getRandomInt(-15, 15);
        this.offsetYbase = misc.getRandomInt(-15, 15);
        this.colorR = misc.getRandomInt(50, 200);
        this.colorG = misc.getRandomInt(50, 200);
        this.colorB = misc.getRandomInt(50, 200);
        this.opacity = 0;
    }
}

Sprite.prototype.scrollRed = function() {
    this.colorR += this.colorDirection;
    if (this.colorR <= 0 || this.colorR >= 255) {
        this.colorDirection *= -1;
    }
}

Sprite.prototype.scrollGreen = function() {
    this.colorG += this.colorDirection;
    if (this.colorG <= 0 || this.colorG >= 255) {
        this.colorDirection *= -1;
    }
}

Sprite.prototype.scrollBlue = function() {
    this.colorB += this.colorDirection;
    if (this.colorB <= 0 || this.colorB >= 255) {
        this.colorDirection *= -1;
    }
}

Sprite.prototype.getCursorDistance = function() {
    // oops, must use square root...
    var distanceX = Math.abs(app.cursorX - this.x);
    var distanceY = Math.abs(app.cursorY - this.y);
    return (distanceX + distanceY) / 2;
}

Sprite.prototype.getCursorDistanceFromOrigin = function() {
    // oops, must use square root...
    var distanceX = Math.abs(app.cursorX - this.originX);
    var distanceY = Math.abs(app.cursorY - this.originY);
    return (distanceX + distanceY) / 2;
}

Sprite.prototype.doCenter = function() {
    this.x = Math.floor( app.canvasWidth / 2 + misc.getRandomInt(-50, 50) );
    this.y = Math.floor( app.canvasHeight / 2 + misc.getRandomInt(-50, 50) );
}

Sprite.prototype.doRelax = function() {
    this.keepInCanvas();
}

Sprite.prototype.adjustOpacityToCursor = function() {
    if (app.cursorActive) {
        this.opacity += this.opacityStep;
        if (this.opacity > this.maxOpacity) { this.opacity = this.maxOpacity; }
    }
    else {
        this.opacity -= this.opacityStep;
        if (this.opacity < 0) { this.opacity = 0; }
    }
}

Sprite.prototype.follow = function(cursorX, cursorY) {
    var targetX, targetY;
    if (app.cursorIn) {
        targetX = cursorX;
        targetY = cursorY;
    }
    else {
        targetX = Math.floor( app.canvasWidth / 2 + misc.getRandomInt(-50, 50) );
        targetY = Math.floor( app.canvasHeight / 2 + misc.getRandomInt(-50, 50) );
    }

    if (this.x > targetX) {
        this.speedX -= this.speedStep;
        if (this.speedX < -this.speedMaxX) { this.speedX = -this.speedMaxX; }
    }
    else if (this.x < targetX) {
        this.speedX += this.speedStep;
        if (this.speedX > this.speedMaxX) { this.speedX = this.speedMaxX; }
    }

    if (this.y > targetY) {
        this.speedY -= this.speedStep;
        if (this.speedY < -this.speedMaxY) { this.speedY = -this.speedMaxY; }
    }
    else if (this.y < targetY) {
        this.speedY += this.speedStep;
        if (this.speedY > this.speedMaxY) { this.speedY = this.speedMaxY; }
    }
}

Sprite.prototype.followSimple = function(targetX, targetY) {
    if (this.x > targetX) {
        this.speedX -= this.speedStep;
        if (this.speedX < -this.speedMaxX) { this.speedX = -this.speedMaxX; }
    }
    else if (this.x < targetX) {
        this.speedX += this.speedStep;
        if (this.speedX > this.speedMaxX) { this.speedX = this.speedMaxX; }
    }

    if (this.y > targetY) {
        this.speedY -= this.speedStep;
        if (this.speedY < -this.speedMaxY) { this.speedY = -this.speedMaxY; }
    }
    else if (this.y < targetY) {
        this.speedY += this.speedStep;
        if (this.speedY > this.speedMaxY) { this.speed = this.speedMaxY; }
    }
}

Sprite.prototype.followX = function(cursorX) {
    var targetX;
    if (app.cursorIn) {
        targetX = cursorX;
    }
    else {
        targetX = Math.floor( app.canvasWidth / 2 + misc.getRandomInt(-50, 50) );
    }

    if (this.x > targetX) {
        this.speedX -= this.speedStep;
        if (this.speedX < -this.speedMaxX) { this.speedX = -this.speedMaxX; }
    }
    else if (this.x < targetX) {
        this.speedX += this.speedStep;
        if (this.speedX > this.speedMaxX) { this.speedX = this.speedMaxX; }
    }
}

Sprite.prototype.followY = function(cursorY) {
    var targetY;
    if (app.cursorIn) {
        targetY = cursorY;
    }
    else {
        targetY = Math.floor( app.canvasHeight / 2 + misc.getRandomInt(-50, 50) );
    }

    if (this.y > targetY) {
        this.speedY -= this.speedStep;
        if (this.speedY < -this.speedMaxY) { this.speedY = -this.speedMaxY; }
    }
    else if (this.y < targetY) {
        this.speedY += this.speedStep;
        if (this.speedY > this.speedMaxY) { this.speedY = this.speedMaxY; }
    }
}

Sprite.prototype.setRGB = function(r, g, b) {
    this.colorR = misc.forceMinMax(r, 0, 255);
    this.colorG = misc.forceMinMax(g, 0, 255);
    this.colorB = misc.forceMinMax(b, 0, 255);
}

Sprite.prototype.setRGBRandom = function() {
    this.colorR = misc.getRandomInt(0, 255);
    this.colorG = misc.getRandomInt(0, 255);
    this.colorB = misc.getRandomInt(0, 255);
}

Sprite.prototype.setRGBSemiRandom = function(highR, highG, highB) {
    this.colorR = highR ? misc.getRandomInt(200, 255) : misc.getRandomInt(50, 100);
    this.colorG = highG ? misc.getRandomInt(200, 255) : misc.getRandomInt(50, 100);
    this.colorB = highB ? misc.getRandomInt(200, 255) : misc.getRandomInt(50, 100);
}

Sprite.prototype.keepInCanvas = function() {
    if ( (this.speedX < 0 && this.x - this.radius <= 0) ||
            (this.speedX > 0 && this.x + this.radius >= app.canvasWidth) ) {
        this.speedX *= -1;
    }

    if ( (this.speedY < 0 && this.y - this.radius <= 0) ||
            (this.speedY > 0 && this.y + this.radius >= app.canvasHeight) ) {
        this.speedY *= -1;
    }
}

Sprite.prototype.keepInCanvasAllowOverlap = function() {
    if ( (this.speedX < 0 && this.x <= 0) ||
            (this.speedX > 0 && this.x >= app.canvasWidth) ) {
        this.speedX *= -1;
    }

    if ( (this.speedY < 0 && this.y <= 0) ||
            (this.speedY > 0 && this.y >= app.canvasHeight) ) {
        this.speedY *= -1;
    }
}

Sprite.prototype.keepInCanvasWithMargin = function(margin) {
    if ( (this.speedX < 0 && this.x <= -margin) ||
            (this.speedX > 0 && this.x >= app.canvasWidth + margin) ) {
        this.speedX *= -1;
    }

    if ( (this.speedY < 0 && this.y <= -margin) ||
            (this.speedY > 0 && this.y >= app.canvasHeight + margin) ) {
        this.speedY *= -1;
    }
}

Sprite.prototype.getRGBString = function(offset) {
    var r = this.colorR + offset;
    var g = this.colorG + offset;
    var b = this.colorB + offset;
    return misc.forceMinMax(r, 0, 255) + ',' + misc.forceMinMax(g, 0, 255) + ',' + misc.forceMinMax(b, 0, 255);
}

Sprite.prototype.draw = function(ctx, drawType, neighbor, spriteCounter) {
    // hack to avoid zero-line drawing
    var oldX = this.oldX, oldY = this.oldY;
    if (this.type != app.enumLineSpray) {
        if (oldX == this.x) { oldX++; }
        if (oldY == this.y) { oldY++; }
    }

    switch (this.type) {

        case app.enumCircleHunter:

            if (drawType == app.enumDrawInk) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(' + this.colorR + ',' + this.colorG + ',' + this.colorB + ',' + this.opacity + ')';

                ctx.moveTo(this.x - this.radius, this.y - this.radius);
                ctx.lineTo(this.x + this.radius, this.y + this.radius);

                ctx.moveTo(this.x + this.radius, this.y - this.radius);
                ctx.lineTo(this.x - this.radius, this.y + this.radius);

                ctx.closePath();
                ctx.stroke();
            }
            else if (drawType == app.enumShow) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgba(255,255,255,.3)';
                ctx.arc(this.x, this.y, this.radius, 0, app.fullCircle, true);
                ctx.strokeStyle = 'rgba(0,0,0,.4)';
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
            break;

        case app.enumLines:
            if (drawType == app.enumDrawInk) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(' + this.colorR + ',' + this.colorG + ',' + this.colorB + ',' + this.opacity + ')';
                ctx.moveTo(neighbor.x, neighbor.y);
                ctx.lineTo(this.x, this.y);
                ctx.closePath();
                ctx.stroke();
            }
            else if (drawType == app.enumShow) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(0,0,0,.1)';
                ctx.moveTo(neighbor.x, neighbor.y);
                ctx.lineTo(this.x, this.y);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgba(255,255,255,.5)';
                ctx.arc(this.x, this.y, this.radius, 0, app.fullCircle, true);
                ctx.strokeStyle = 'rgba(0,0,0,.4)';
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
            break;


 /*       default:

            if (drawType == app.enumDrawInk) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(' + this.colorR + ',' + this.colorG + ',' + this.colorB + ',' + this.opacity + ')';
                ctx.arc(this.x, this.y, this.radius / 2, 0, app.fullCircle, true);
                ctx.fill();
                ctx.closePath();
            }
            else if (drawType == app.enumShow) {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgba(255,255,255,.6)';
                ctx.arc(this.x, this.y, this.radius, 0, app.fullCircle, true);
                ctx.strokeStyle = 'rgba(0,0,0,.6)';
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
            break;*/
    }
}


/**** Misc. functions ****/

function MiscLibrary() {
}

MiscLibrary.prototype.getRandomInt = function(min, max) {
    return Math.floor( ( (max + 1 - min) * Math.random() ) + min );
}

MiscLibrary.prototype.getRandom = function(min, max) {
    return (max - min) * Math.random() + min;
}

MiscLibrary.prototype.chance = function(chanceInPercent) {
	return this.getRandom(0, 100) <= chanceInPercent;
}


MiscLibrary.prototype.forceMinMax = function(v, min, max) {
    if (v < min) {
        v = min;
    }
    else if (v > max) {
        v = max;
    }
    return v;
}

MiscLibrary.prototype.forceMin = function(v, min) {
    return v < min ? min : v;
}

MiscLibrary.prototype.forceMax = function(v, max) {
    return v > max ? max : v;
}

MiscLibrary.prototype.showElm = function(id) {
    var elm = document.getElementById(id);
    if (elm) { elm.style.display = 'block'; }
}

MiscLibrary.prototype.hideElm = function(id) {
    var elm = document.getElementById(id);
    if (elm) { elm.style.display = 'none'; }
}

MiscLibrary.prototype.getDistance = function(x1, y1, x2, y2) {
    var distanceX = x1 - x2;
    var distanceY = y1 - y2;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

