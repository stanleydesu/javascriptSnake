"use strict";

(function() {
	const canvas = document.getElementById('canvas'),
		  c = canvas.getContext('2d');

	canvas.width = innerWidth;
	canvas.height = innerHeight;

	function Snake(x, y, direction) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.length = 15;
		this.speed = this.length + 1;
		this.moveQueue = [];
		this.changeDirection = function(direction) {
			const opposites = {
				up: 'down',
				left: 'right',
				right: 'left',
				down: 'up'
			};
			// prevent snake from going the opposite direction
			if (this.direction !== opposites[direction]) {
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
			c.fillRect(this.x, this.y, this.length, this.length);
			c.fillStyle = 'white';
			c.fill();
		};
	}

	const snake = new Snake(Math.floor(Math.random() * innerWidth), Math.floor(Math.random() * innerHeight), '');

	window.addEventListener('keydown', function(e) {
		let key = String.fromCharCode(e.which);
		console.log(key);
		switch(key) {
			case 'W':
				snake.changeDirection('up');
				break;
			case 'A':
				snake.changeDirection('left');
				break;
			case 'S':
				snake.changeDirection('down');
				break;
			case 'D':
				snake.changeDirection('right');
				break;
			default:
				break;
		}
	});

	setInterval(function() {
		c.clearRect(0, 0, innerWidth, innerHeight);
		snake.direction = snake.moveQueue.pop() || snake.direction;
		snake.update();
	}, 80);
}());