var width = 10;
var height = 16;
var START_X = 4;
var START_Y = 0;
var newBlock = true;
var current;
var current_type;
var current_x;
var current_y;
var score = 0;
var rowsRemoved = 0;
var main_interval;
var clock_period_ms = 750;

var collision_delta = {
	"down" : 
	{ 
		"x" : 0,
		"y" : 1
	},	
	"left" : 
	{ 
		"x" : -1,
		"y" : 0 
	},	
	"right" : 
	{ 
		"x" : 1,
		"y" : 0 
	}	
}

var blocks = {
	"i" : [[1, 0], [2, 0], [-1, 0]],
	"j" : [[-1, -1], [-1, 0], [1, 0]],
	"l" : [[-1, 0], [1, 0], [1, -1]],
	"o" : [[0, -1], [1, -1], [1, 0]],
	"s" : [[-1, 0], [0, -1], [1, -1]],
	"t" : [[1, 0], [0, -1], [-1, 0]],
	"z" : [[1, 0], [0, -1], [-1, -1]]
}

function rotate() {
	if(current_type == "o") {
		return;
	}
	var i;
	for(i = 0; i < current.length; i++) {
		var x = current[i][0];
		var y = current[i][1];
		current[i][0] = -1 * y;
		current[i][1] = x;
	}
}

function min_x() {
	return Math.min(current[0][0],
			current[1][0],
			current[2][0]);
}

function max_x() {
	return Math.max(current[0][0],
			current[1][0],
			current[2][0]);
}

function max_y() {
	return Math.max(current[0][1],
			current[1][1],
			current[2][1]);
}

function randomBlock() {
	var b = ["i", "j", "l", "o", "s", "t", "z"];
	return b[Math.floor(Math.random() * b.length)];
}

function lostGame() {
	var col, row, lost;

	// see if the top row is empty
	for(col = 0; col < width; col++) {
		if(isOn(col, 0)) {
			return true;
		}
	}

	return false;
}

var width = 10;
var height = 16;
var START_X = 4;
var START_Y = 0;
var newBlock = true;
var currentBlock;
var current;
var current_x;
var current_y;

function on(x, y) {
	$("#" + String(x) + "_" + String(y)).addClass("on");
}

function off(x, y) { 
	$("#" + String(x) + "_" + String(y)).removeClass("on");
}

function isOn(x, y) {
	return $("#" + String(x) + "_" + String(y)).hasClass("on");
}

function drawBlock(x, y) {
	var i;
	on(x, y);
	for(i = 0; i < current.length; i++) {
		on(x + current[i][0], y + current[i][1]);
	}
}

function clearBlock(x, y) {
	var i;
	off(x, y);
	for(i = 0; i < current.length; i++) {
		off(x + current[i][0], y + current[i][1]);
	}
}

function clearScreen() {
	for(y = 0; y < height; y++) {	
		for(x = 0; x < width; x++) {
			off(x, y);
		}
	}
}

function fillScreen() {
	for(y = 0; y < height; y++) {	
		for(x = 0; x < width; x++) {
			on(x, y);
		}
	}
}

function clearRow(row) {
	var col;
	for(col = 0; col < width; col++) {
		off(col, row);
	}
}

function fillScreen() {
	for(y = 0; y < height; y++) {	
		for(x = 0; x < width; x++) {
			on(x, y);
		}
	}
}

function copyRow(source, dest) {
	var col;
	for(col = 0; col < width; col++) {
		if(isOn(col, source)) {
			on(col, dest);
		}
	}
}

function moveDownAboveRow(row) {
	var i;
	for(i = row - 1; i >= 0; i--) {
		copyRow(i, i + 1);
		clearRow(i);
	}
}


function isMember(x, y) {
	var j;
	if(x == 0 && y == 0) {
		return true;
	}
	for(j = 0; j < current.length; j++) {
		if((x == current[j][0]) && (y == current[j][1])) {
			return true;
		}
	}
	return false;
}

function collision(direction) {
	var i; 
	var x;
	var y;

	for(i = 0; i < current.length; i++) {
		x = current[i][0] + collision_delta[direction].x;
		y = current[i][1] + collision_delta[direction].y;

		if(!isMember(x, y) && isOn(current_x + x, current_y + y)) {
			return true;
		}
	}

	// check 0, 0 as well
	x = collision_delta[direction].x;
	y = collision_delta[direction].y;

	if(!isMember(x, y) && isOn(current_x + x, current_y + y)) {
		return true;
	}
	
	return false;
}

function hitBottom() {
	return (current_y + max_y()) == (height - 1);
}

function removeFullRows() {
	var row;
	var col;
	var rowsToRemove = [];
	var isFull;
	for(row = height - 1; row >= 0; row--) {
		isFull = true;
		for(col = 0; col < width; col++) {
			if(!isOn(col, row)) {
				isFull = false;
				break;
			}
		}
		if(isFull) {
			rowsRemoved++;
			clearRow(row);
			moveDownAboveRow(row);
			removeFullRows();
		}
	}
}

function updateScore() {
	if(rowsRemoved == 4) {
		if(lastWasTetris) {
			score += 1200;
		}
		else {
			score += 800;
		}
		
		lastWasTetris = true;
	}
	else if(rowsRemoved != 0) {
		score += rowsRemoved * 100;
	}
	rowsRemoved = 0;
	lastWasTetris = false;
	$("#score").html(score);
}

function newGame() {
	$("#youlose").toggle();
	clearScreen();
	score = 0;
	$("#score").html(score);
	main_interval = setInterval(function () {
		main();
	}, clock_period_ms);
}

function initializeKeyboardInput() {
	$(document).keypress(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 97) { // left 'a'
			if(!collision("left") && (current_x + min_x()) > 0) {
				clearBlock(current_x, current_y);
				current_x -= 1;
				drawBlock(current_x, current_y);
			}
		}
		else if(code == 100) { // right 'd'
			if(!collision("right") && (current_x + max_x()) < (width - 1)) {
				clearBlock(current_x, current_y);
				current_x += 1;
				drawBlock(current_x, current_y);
			}
		}
		else if(code == 115) { // down 's'
			if(hitBottom() || collision("down")) {
				newBlock = true;
				return;
			}
			clearBlock(current_x, current_y);
			current_y += 1;
			drawBlock(current_x, current_y);
		}
		else if(code == 119) { // rotate 'w'
			clearBlock(current_x, current_y);
			rotate();
			drawBlock(current_x, current_y);
		}
		else if(code == 110) {
			newGame();
		}
	});
}

function main() {
	if(newBlock) {
		if(lostGame()) {
			$("#youlose").toggle();
			fillScreen();
			clearInterval(main_interval);
			return;
		}
		removeFullRows();
		updateScore();
		current_type = randomBlock();
		current = jQuery.extend(true, [], blocks[current_type]);
		drawBlock(START_X, START_Y);
		current_x = START_X;
		current_y = START_Y;
		newBlock = false;
	}

	if(hitBottom() || collision("down")) {
		newBlock = true;
		return;
	}
	clearBlock(current_x, current_y);
	current_y += 1;
	drawBlock(current_x, current_y);
}

$(document).ready(function() {
	$("#youlose").toggle();
	var x;
	var y;
	var i;
	for(y = 0; y < height; y++) {	
		for(x = 0; x < width; x++) {
			$("#grid").append("<li id=" + String(x) + "_" + String(y) + "></li>");
		}
	}

	initializeKeyboardInput();

	main_interval = setInterval(function () {
		main();
	}, clock_period_ms);

});