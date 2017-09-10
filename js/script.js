"use strict";

(function() {
	// =====================================
	// ============= VARIABLES =============
	// =====================================
	const canvas = document.getElementById('canvas'),
		  c = canvas.getContext('2d'),
		  scoreDiv = document.getElementById('score'),
		  blockSize = 15; // universal side length of a square

	let snake,
		food, 
		timer, 
		cw, // canvas width
		ch, // canvas height
		isPaused = false;

	// =====================================
	// ============= FUNCTIONS =============
	// =====================================

	// snake constructor
	// snake can move in 4 directions, up, right, down, left, or be stationary
	//   1
	// 4 0 2
	//   3
	class Snake {
		constructor(x, y, direction) {
			this._direction = direction;
			this._length = blockSize;
			this._speed = blockSize;
			this._moveQueue = [];
			this._segments = [{x: x, y: y}]; // parts of the snake
			this._growth = 0; // number of segment the snake needs to grow
			// moves the snake modifying the current head and adding a new head
			this._move = [
				// stationary
				(segment) => {
					this._segments.unshift(segment);
				},
				// up
				(segment) => {
					segment.y -= this._speed;
					this._segments.unshift(segment);
				},
				// right
				(segment) => {
					segment.x += this._speed;
					this._segments.unshift(segment);
				},
				// down
				(segment) => {
					segment.y += this._speed;
					this._segments.unshift(segment);
				},
				// left
				(segment) => {
					segment.x -= this._speed;
					this._segments.unshift(segment);
				}
			];
		}
		get head() {
			return this._segments[0];
		}
		set direction(direction) {
			// prevent snake from going opposite direction or adding current direction to movequeue
			if (!this._direction || (this._direction !== direction + (direction <= 2 ? 2 : -2)) && (direction !== this._moveQueue[0])) {
				this._moveQueue.unshift(direction);
			}
		}
		// moves, grows (if required) and draws the snake
		update() {
			// create new head
			let segment = Object.assign({}, this.head);
			this._move[this._direction](segment);
			// if snake should grow, don't remove tail
			if (this._growth) {
				--this._growth;
			} else {
				// remove tail
				this._segments.pop();
			}
			this.draw();
		}
		draw() {
			c.beginPath();
			c.fillStyle = '#fff';
			c.strokeStyle = '#222';
			c.lineWidth = '2';
			for (let i = 0, len = this._segments.length; i < len; ++i) {
				let segment = this._segments[i];
				c.fillRect(segment.x, segment.y, this._length, this._length);
				c.strokeRect(segment.x, segment.y, this._length, this._length);
			}
		}
	}

	// food constructor
	class Food {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.length = blockSize;
		}
		get pos() {
			return {x: this.x, y: this.y};
		}
		respawn() {
			this.x = Math.floor(Math.random() * (cw / blockSize)) * blockSize;
			this.y = Math.floor(Math.random() * (ch / blockSize)) * blockSize;
		}
		draw() {
			c.beginPath();
			c.fillStyle = '#0c8';
			c.strokeStyle = '#222';
			c.lineWidth = '2';
			c.fillRect(this.x, this.y, this.length, this.length);
			c.strokeRect(this.x, this.y, this.length, this.length);
		}
	}

	// checks if two coordinates are in the same position
	// if pos2 is an array of coordinates, the function will return true
	// if any of pos2's items are equal to pos1
	const inEqualPositions = (pos1, pos2) => {
		if (Array.isArray(pos2)) {
			return pos2.some((curr) => {
				return inEqualPositions(pos1, curr)
			});
		} else {
			return pos1.x === pos2.x && pos1.y === pos2.y;
		}
	}

	// resizes canvas dimensions
	const resize = () => {
		cw = (Math.floor(innerWidth / blockSize) - 5) * blockSize;
		ch = (Math.floor(innerHeight / blockSize) - 5) * blockSize;
		canvas.width = cw;
		canvas.height = ch;
	}

	// toggles between play and pause mode
	const togglePause = () => {
		isPaused ? play() : pause();
	}

	const handleDeath = (score) => {
		let highscore = JSON.parse(localStorage.getItem('highscore')),
			message = 'Your snake died. ';
		// if there is no highscore or current score is higher than highscore
		if (!highscore || score > highscore) {
			localStorage.setItem('highscore', JSON.stringify(score));
			message += `New highscore: ${score}`;
		} else {
			message += `Score: ${score}. Highscore: ${highscore}`;
		}
		alert(message);
	}

	// plays the game and performs checks
	const play = () => {
		// update the game every 80 milliseconds
		timer = setInterval(() => {
			// clear the canvas
			c.clearRect(0, 0, innerWidth, innerHeight);
			// set snake's direction to the least recent move
			snake._direction = snake._moveQueue.pop() || snake._direction;
			// draw in food
			food.draw();
			// move and draw the snake
			snake.update();
			let head = snake.head;
			// if snake has eaten food
			if (inEqualPositions(head, food.pos)) {
				// spawn food in a snake-free square
				do {
					food.respawn();
				}
				while (inEqualPositions(food.pos, snake._segments));
				// increase length of snake
				snake._growth = 5;
			}
			// if snake eats itself
			for (let i = 1, len = snake._segments.length; i < len; ++i) {
				if (inEqualPositions(head, snake._segments[i])) {
					handleDeath(snake._segments.length);
					init();
				}
			}
			// if snake hits the walls
			if (head.x < 0 || head.x >= cw || head.y < 0 || head.y >= ch) {
				handleDeath(snake._segments.length);
				init();
			}
			// update score
			scoreDiv.textContent = snake._segments.length;
		}, 80);
		isPaused = false;
	}

	// pauses game
	const pause = () => {
		clearInterval(timer);
		isPaused = true;
	}

	// initialises game 
	const init = () => {
		resize();
		snake = new Snake(Math.floor(Math.random() * (cw / blockSize)) * blockSize, 
									 Math.floor(Math.random() * (ch / blockSize)) * blockSize, 0);
		food = new Food(Math.floor(Math.random() * (cw / blockSize)) * blockSize, 
								   Math.floor(Math.random() * (ch / blockSize)) * blockSize);
		pause(); // reset timer
		play();
	}

	// =====================================
	// ========== EVENT LISTENERS ==========
	// =====================================

	// handle user input for movement
	window.addEventListener('keydown', (e) => {
		let key = e.which || e.keyCode;
		switch(key) {
			case 38:
			case 87:
				snake.direction = 1;
				break;
			case 39:
			case 68:
				snake.direction = 2;
				break;
			case 40:
			case 83:
				snake.direction = 3;
				break;
			case 37:
			case 65:
				snake.direction = 4;
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

	// =====================================
	// ============= RUN THE GAME ==========
	// =====================================

	init();
}());