// All boid simulation based on https://www.nickfrosst.com/

var NUM_BOIDS = 4;
var REFRESH_INTERVAL_IN_MS = 15;
var mouse_position = new Vector(0, 0);

function Simulation(name) {
	var canvas = document.getElementById(name);
	var canvas$ = $(canvas);

	this.ctx = canvas.getContext('2d');
	this.canvasHeight = canvas$.height();
	this.canvasWidth = canvas$.width();
	this.separationMultiplier = 2;
	this.cohesionMultiplier = 1;
	this.alignmentMultiplier = 1;
	this.avoid_mouse = false;
}

Simulation.prototype = {
	initialize: function (use_obstacle, avoid_mouse) {
		this.obstacles = [];
		if (use_obstacle) {
			this.addObstacle(new Obstacle(this.canvasWidth / 2, this.canvasHeight / 2, 40, 2, this))
		}
		this.avoid_mouse = avoid_mouse
		this.boids = [];
		var start_x = Math.floor(Math.random() * this.canvasWidth);
		var start_y = Math.floor(Math.random() * this.canvasHeight);
		for (var i = 0; i < NUM_BOIDS; i++) {
			var boid = new Boid(start_y, start_x, this);
			this.addBoid(boid);
		}
	},
	addBoid: function (boid) {
		this.boids.push(boid);
	},
	addObstacle: function (obstacle) {
		this.obstacles.push(obstacle);
	},
	render: function () {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		for (var bi in this.boids) {
			this.boids[bi].run(this.boids);
		}
		for (var ob in this.obstacles) {
			this.obstacles[ob].render(this.obstacles);
		}
	},
	tick: function () {
		for (var bi in this.boids) {
			var boid = this.boids[bi];
			boid.flock(this.boids);
			for (var ob in this.obstacles) {
				var obstacle = this.obstacles[ob];
			}
		}
	},
	
	run: function () {
		var self = this;
		self.tick();
		setInterval(function () {
			self.tick();
			self.render();
		}, REFRESH_INTERVAL_IN_MS);
	},

	update_mouse_position: function (x, y) {
		mouse_position.update(x, y);
	},

	update_separationMultiplier: function (value) {
		this.separationMultiplier = value;
	},

	update_cohesionMultiplier: function (value) {
		this.cohesionMultiplier = value;
	},

	update_alignmentMultiplier: function (value) {
		this.alignmentMultiplier = value;
	},
}
	;
