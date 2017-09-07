"use strict";

(function() {
	const canvas = document.getElementById('canvas'),
		  c = canvas.getContext('2d'),
		  blockSize = 15,
		  cw = 600,
		  ch = 300;

	canvas.width = cw;
	canvas.height = ch;

	let timer,
		isPaused = false;

	function Snake(x, y, direction) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.length = blockSize;
		this.speed = blockSize;
		this.moveQueue = [];
		this.segments = [{x: this.x, y: this.y}];
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
				this.y -= this.speed;
			},
			right: () => {
				this.x += this.speed;
			},
			down: () => {
				this.y += this.speed;
			},
			left: () => {
				this.x -= this.speed;
			},
			'': () => {}
		};
		this.update = function() {
			this.move[this.direction]();
			this.draw();
		};
		this.draw = function() {
			c.beginPath();
			c.strokeStyle = '#fff';
			c.strokeRect(this.x, this.y, this.length, this.length);
			c.fillStyle = '#fff';
			c.fillRect(this.x, this.y, this.length, this.length);
		};
	}

	const snake = new Snake(0, 0, '');

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
			// move and draw the snake
			snake.update();
		}, 80);
		isPaused = false;
	}

	function pause() {
		clearInterval(timer);
		isPaused = true;
	}

	play();
}());