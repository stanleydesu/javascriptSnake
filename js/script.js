"use strict";

(function() {
	// ===================================================================
	// ========================= VARIABLES ===============================
	// ===================================================================
	const canvas = document.getElementById('canvas'),
		  c = canvas.getContext('2d'),
		  blockSize = 15; // universal side length of a square

	let snake,
		food, 
		timer, 
		cw, // canvas width
		ch, // canvas height
		isPaused = false;

	// ===================================================================
	// ========================= FUNCTIONS ===============================
	// ===================================================================

	// resizes canvas dimensions
	function resize() {
		cw = (Math.floor(innerWidth / blockSize) - 5) * blockSize;
		ch = (Math.floor(innerHeight / blockSize) - 5) * blockSize;
		canvas.width = cw;
		canvas.height = ch;
	}

	// snake constructor
	function Snake(x, y, direction) {
		this.direction = direction;
		this.length = blockSize;
		this.speed = blockSize;
		this.moveQueue = [];
		this.segments = [{x: x, y: y}]; // parts of the snake
		this.growth = 0; // number of segments the snake needs to grow
		this.getHead = function() {
			return this.segments[0];
		};
		this.getTail = function() {
			return this.segments[this.segments.length - 1];
		};
		this.changeDirection = function(direction) {
			const opposites = {
				up: 'down',
				left: 'right',
				right: 'left',
				down: 'up'
			};
			// prevent snake from going opposite direction or adding current direction to movequeue
			if (this.direction !== opposites[direction] && direction !== this.moveQueue[0]) {
				this.moveQueue.unshift(direction);
			}
		};
		// moves the snake by creating a new object equal to the current head
		// and moving the new object in the current direction
		this.move = {
			up: () => {
				let segment = Object.assign({}, this.getHead());
				segment.y -= this.speed;
				this.segments.unshift(segment);
			},
			right: () => {
				let segment = Object.assign({}, this.getHead());
				segment.x += this.speed;
				this.segments.unshift(segment);
			},
			down: () => {
				let segment = Object.assign({}, this.getHead());
				segment.y += this.speed;
				this.segments.unshift(segment);
			},
			left: () => {
				let segment = Object.assign({}, this.getHead());
				segment.x -= this.speed;
				this.segments.unshift(segment);
			},
			'': () => {
				let segment = Object.assign({}, this.getHead());
				this.segments.unshift(segment);
			}
		};
		// moves, grows (if required) and draws the snake
		this.update = function() {
			this.move[this.direction]();
			// if snake should grow
			if (this.growth) {
				--this.growth;
			} else {
				this.segments.pop();
			}
			this.draw();
		};
		this.draw = function() {
			c.beginPath();
			c.fillStyle = '#fff';
			c.strokeStyle = '#222';
			c.lineWidth = '2';
			for (let i = 0, len = this.segments.length; i < len; ++i) {
				let segment = this.segments[i];
				c.fillRect(segment.x, segment.y, this.length, this.length);
				c.strokeRect(segment.x, segment.y, this.length, this.length);
			}
		};
	}

	// food constructor
	function Food(x, y) {
		this.x = x;
		this.y = y;
		this.length = blockSize;
		this.getPos = function() {
			return {x: this.x, y: this.y};
		};
		this.respawn = function() {
			this.x = Math.floor(Math.random() * (cw / blockSize)) * blockSize;
			this.y = Math.floor(Math.random() * (ch / blockSize)) * blockSize;
		};
		this.draw = function() {
			c.beginPath();
			c.fillStyle = '#0c8';
			c.strokeStyle = '#222';
			c.lineWidth = '2';
			c.fillRect(this.x, this.y, this.length, this.length);
			c.strokeRect(this.x, this.y, this.length, this.length);
		};
	}

	// checks if two coordinates are in the same position
	function inEqualPositions(pos1, pos2) {
		return pos1.x === pos2.x && pos1.y === pos2.y;
	}

	// initialisation function
	function init() {
		resize();
		snake = new Snake(Math.floor(Math.random() * (cw / blockSize)) * blockSize, 
		  				  Math.floor(Math.random() * (ch / blockSize)) * blockSize, '');
		food = new Food(Math.floor(Math.random() * (cw / blockSize)) * blockSize, 
		  				Math.floor(Math.random() * (ch / blockSize)) * blockSize);
		play();
		
	}

	// toggles between play and pause mode
	function togglePause() {
		isPaused ? play() : pause();
	}

	// plays the game and performs checks
	function play() {
		// update the game every 80 milliseconds
		timer = setInterval(function() {
			// clear the canvas
			c.clearRect(0, 0, innerWidth, innerHeight);
			// set snake's direction to the least recent move
			snake.direction = snake.moveQueue.pop() || snake.direction;
			// draw in food
			food.draw();
			// move and draw the snake
			snake.update();
			let head = snake.getHead();
			// if snake has eaten food
			if (inEqualPositions(head, food.getPos())) {
				// change position of food
				food.respawn();
				// increase length of snake
				snake.growth = 5;
			}
			// if snake eats itself
			for (let i = 1, len = snake.segments.length; i < len; ++i) {
				if (inEqualPositions(head, snake.segments[i])) {
					alert('You lose xD');
					// restart game
					init();
				}
			}
			// if snake hits the walls
			if (head.x < 0 || head.x > cw || head.y < 0 || head.y > ch) {
				alert('You lose xD');
				// restart game
				init();
			}
		}, 70);
		isPaused = false;
	}

	// pauses game
	function pause() {
		clearInterval(timer);
		isPaused = true;
	}

	// ===================================================================
	// ========================= EVENT LISTENERS =========================
	// ===================================================================

	// handle user input for movement
	window.addEventListener('keydown', function(e) {
		let key = e.which || e.keyCode;
		switch(key) {
			case 38:
			case 87:
				snake.changeDirection('up');
				break;
			case 37:
			case 65:
				snake.changeDirection('left');
				break;
			case 40:
			case 83:
				snake.changeDirection('down');
				break;
			case 39:
			case 68:
				snake.changeDirection('right');
				break;
			case 32:
				togglePause();
				break;
			default:
				break;
		}
	});

	// resize the canvas if the window size changes
	window.addEventListener('resize', resize);

	// ===================================================================
	// ========================== RUN THE GAME ===========================
	// ===================================================================

	init();
}());