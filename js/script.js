"use strict";

(function() {
	const canvas = document.getElementById('canvas'),
		  c = canvas.getContext('2d'),
		  blockSize = 15,
		  cw = 900,
		  ch = 450;

	canvas.width = cw;
	canvas.height = ch;

	let timer,
		isPaused = false;

	function Snake(x, y, direction) {
		this.direction = direction;
		this.length = blockSize;
		this.speed = blockSize;
		this.moveQueue = [];
		this.segments = [{x: x, y: y}]; // parts of the snakes
		this.growth = 0;
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
			// prevent snake from going the opposite direction
			// or adding current direction to movequeue
			if (this.direction !== opposites[direction] && direction !== this.moveQueue[0]) {
				this.moveQueue.unshift(direction);
			}
		};
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

	function Food(x, y) {
		this.x = x;
		this.y = y;
		this.length = blockSize;
		this.getPos = function() {
			return {x: this.x, y: this.y};
		};
		this.update = function() {
			this.x = Math.floor(Math.random() * (cw / blockSize)) * blockSize;
			this.y = Math.floor(Math.random() * (ch / blockSize)) * blockSize;
		}
		this.draw = function() {
			c.beginPath();
			c.fillStyle = '#0c8';
			c.strokeStyle = '#222';
			c.lineWidth = '2';
			c.fillRect(this.x, this.y, this.length, this.length);
			c.strokeRect(this.x, this.y, this.length, this.length);
		};
	}

	function inEqualPositions(pos1, pos2) {
		return pos1.x === pos2.x && pos1.y === pos2.y;
	}

	const snake = new Snake(Math.floor(Math.random() * (cw / blockSize)) * blockSize, 
		  				  Math.floor(Math.random() * (ch / blockSize)) * blockSize, ''),
		  food = new Food(Math.floor(Math.random() * (cw / blockSize)) * blockSize, 
		  				  Math.floor(Math.random() * (ch / blockSize)) * blockSize);

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

	function togglePause() {
		isPaused ? play() : pause();
	}

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
			// if snake has eaten food
			if (inEqualPositions(snake.getHead(), food.getPos())) {
				// change position of food
				food.update();
				// increase length of snake
				snake.growth = 5;
			}
		}, 80);
		isPaused = false;
	}

	function pause() {
		clearInterval(timer);
		isPaused = true;
	}

	play();
}());