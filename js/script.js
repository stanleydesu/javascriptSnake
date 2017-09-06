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
		this.changeDirection = function(direction) {
			const opposites = {
				up: 'down',
				left: 'right',
				right: 'left',
				down: 'up'
			};
			if (this.direction !== opposites[direction]) {
				this.direction = direction;
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

	window.addEventListener('keypress', function(e) {
		let key = String.fromCharCode(e.which);
		switch(key) {
			case 'w':
				snake.changeDirection('up');
				break;
			case 'a':
				snake.changeDirection('left');
				break;
			case 's':
				snake.changeDirection('down');
				break;
			case 'd':
				snake.changeDirection('right');
				break;
			default:
				break;
		}
	});

	setInterval(function() {
		c.clearRect(0, 0, innerWidth, innerHeight);
		snake.update();
	}, 100);
}());