// All boid simulation based on https://www.nickfrosst.com/// All boid simulation based on https://www.nickfrosst.com/

var MAX_SPEED = 6;
var MAX_FORCE = 0.1;
var DESIRED_SEPARATION = 40;
var MOUSE_DESIRED_SEPARATION = 200;
var OBSTACLE_DESIRED_SEPARATION = 200;
var NEIGHBOR_DISTANCE = 60;
var BORDER_OFFSET = 10;
var EPSILON = 0.0000001;
var render_size = 10;
var death_throws = 0;
var avoidanceMultiplier = 2;



function Boid(x, y, simulation) {
	var randomAngle = Math.random() * 2 * Math.PI;
	this.velocity = new Vector(Math.cos(randomAngle), Math.sin(randomAngle));
	this.position = new Vector(x, y);
	this.acceleration = new Vector(0, 0);
	this.simulation = simulation;
	this.render_size = render_size
	this.death_throws = death_throws
	this.sabateur = false;

	this.image = new Image();
    this.image.src = 'standardBoids/boid.png';
}

Boid.prototype = {

	render: function () {
		const ctx = this.simulation.ctx;

		// Check if the image is loaded
		if (!this.image) {
			this.image = new Image();
			this.image.src = 'boid.png'; // Make sure boid.png is in the correct path
		}
	
		const scale = 2; // Scaling factor (e.g., 1.5, 2, 3 for larger images)
	
		if (this.image.complete && this.image.naturalHeight !== 0) {
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.rotate(this.velocity.getAngle());
	
			// Adjust the size based on the scale factor
			ctx.drawImage(
				this.image,
				-this.render_size * scale / 2, // Center horizontally
				-this.render_size * scale / 2, // Center vertically
				this.render_size * scale, // Width
				this.render_size * scale // Height
			);
	
			ctx.restore();
		} else {
			// Fallback rendering (triangle shape)
			var directionVector = this.velocity.normalize().multiplyBy(this.render_size * scale);
			var inverseVector1 = new Vector(-directionVector.y, directionVector.x).divideBy(3);
			var inverseVector2 = new Vector(directionVector.y, -directionVector.x).divideBy(3);
	
			ctx.beginPath();
			ctx.moveTo(this.position.x, this.position.y);
			ctx.lineTo(this.position.x + inverseVector1.x, this.position.y + inverseVector1.y);
			ctx.lineTo(this.position.x + directionVector.x, this.position.y + directionVector.y);
			ctx.lineTo(this.position.x + inverseVector2.x, this.position.y + inverseVector2.y);
			ctx.lineTo(this.position.x, this.position.y);
	
			ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
			ctx.stroke();
	
			if (this.sabateur) {
				ctx.fillStyle = 'rgba(22, 236, 22, 0.8)';
			} else if (this.death_throws === 0) {
				ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
			} else {
				ctx.fillStyle = 'rgba(22, 72, 236, 0.8)';
			}
			ctx.fill();
		}
	},

	//
	// Rule 1: Boids try to fly towards the centre of mass of neighbouring boids.
	getCohesionVector: function (boids) {
		var totalPosition = new Vector(0, 0);
		var neighborCount = 0;
		for (var bi in boids) {
			var boid = boids[bi];
			if (this == boid) {
				continue;
			}

			var distance = this.position.getDistance(boid.position) + EPSILON;
			if (distance <= NEIGHBOR_DISTANCE) {
				totalPosition = totalPosition.add(boid.position);
				neighborCount++;
			}
		}

		if (neighborCount > 0) {
			var averagePosition = totalPosition.divideBy(neighborCount);
			return this.seek(averagePosition);
		} else {
			return new Vector(0, 0);
		}
	},

	seek: function (targetPosition) {
		var desiredVector = targetPosition.subtract(this.position);

		// Scale to the maximum speed
		desiredVector.iSetMagnitude(MAX_SPEED);

		// Steering = Desired minus Velocity
		var steeringVector = desiredVector.subtract(this.velocity);
		steeringVector = steeringVector.limit(MAX_FORCE);

		return steeringVector;
	},

	//
	// Rule 2: Boids try to keep a small distance away from other objects (including other boids).
	getSeparationVector: function (boids) {

		var steeringVector = new Vector(0, 0);
		var neighborCount = 0;

		for (var bi in boids) {
			var boid = boids[bi];
			if (this == boid) {
				continue;
			}

			var distance = this.position.getDistance(boid.position) + EPSILON;
			if (distance > 0 && distance < DESIRED_SEPARATION) {
				var deltaVector = this.position.subtract(boid.position);
				deltaVector.iNormalize();
				deltaVector.iDivideBy(distance);
				steeringVector.iAdd(deltaVector);
				neighborCount++;
			}
		}

		if (neighborCount > 0) {
			var averageSteeringVector = steeringVector.divideBy(neighborCount);
		} else {
			var averageSteeringVector = new Vector(0, 0);
		}

		var distance = this.position.getDistance(mouse_position) + EPSILON;
		if (distance > 0 && distance < MOUSE_DESIRED_SEPARATION && this.simulation.avoid_mouse) {
			var deltaVector = this.position.subtract(mouse_position);
			deltaVector.iNormalize();
			deltaVector.iDivideBy(distance ** 2);
			deltaVector.iMultiplyBy(5000);
			averageSteeringVector.iAdd(deltaVector);
		}

		for (var ob in this.simulation.obstacles) {
			var obstacle = this.simulation.obstacles[ob];

			var distance = this.position.getDistance(obstacle.position) + EPSILON;
			if (distance > 0 && distance < OBSTACLE_DESIRED_SEPARATION) {
				var deltaVector = this.position.subtract(obstacle.position);
				deltaVector.iNormalize();
				deltaVector.iDivideBy(distance);
				steeringVector.iAdd(deltaVector);
				if (this.sabateur) {
					deltaVector.iMultiplyBy(-obstacle.repulsion);
				} else {
					deltaVector.iMultiplyBy(obstacle.repulsion);
				}
				averageSteeringVector.iAdd(deltaVector);
			}
		}



		if (averageSteeringVector.getMagnitude() > 0) {
			averageSteeringVector.iSetMagnitude(MAX_SPEED);
			averageSteeringVector.iSubtract(this.velocity);
			averageSteeringVector.iLimit(MAX_FORCE);
		}

		return averageSteeringVector;
	},

	//
	// Rule 3: Boids try to match velocity with near boids.
	getAlignmentVector: function (boids) {
		var perceivedFlockVelocity = new Vector(0, 0);
		var neighborCount = 0;

		for (var bi in boids) {
			var boid = boids[bi];
			if (this == boid) {
				continue;
			}

			var distance = this.position.getDistance(boid.position) + EPSILON;
			if (distance > 0 && distance < NEIGHBOR_DISTANCE) {
				perceivedFlockVelocity.iAdd(boid.velocity);
				neighborCount++;
			}
		}

		if (neighborCount > 0) {

			var averageVelocity = perceivedFlockVelocity.divideBy(neighborCount);
			averageVelocity.iSetMagnitude(MAX_SPEED);

			var steeringVector = averageVelocity.subtract(this.velocity);
			steeringVector.iLimit(MAX_FORCE);

			return steeringVector;
		} else {
			return new Vector(0, 0);
		}
	},

	flock: function (boids) {
		var cohesionVector = this.getCohesionVector(boids);
		var separationVector = this.getSeparationVector(boids);
		var alignmentVector = this.getAlignmentVector(boids);

		separationVector.iMultiplyBy(this.simulation.separationMultiplier);
		cohesionVector.iMultiplyBy(this.simulation.cohesionMultiplier);
		alignmentVector.iMultiplyBy(this.simulation.alignmentMultiplier);

		this.acceleration.iAdd(cohesionVector);
		this.acceleration.iAdd(separationVector);
		this.acceleration.iAdd(alignmentVector);
	},

	bound: function () {

		if (this.position.x > this.simulation.canvasWidth + BORDER_OFFSET) {
			this.position.x = -BORDER_OFFSET;
		}

		if (this.position.x < -BORDER_OFFSET) {
			this.position.x = this.simulation.canvasWidth + BORDER_OFFSET;
		}

		if (this.position.y > this.simulation.canvasHeight + BORDER_OFFSET) {
			this.position.y = -BORDER_OFFSET;
		}

		if (this.position.y < -BORDER_OFFSET) {
			this.position.y = this.simulation.canvasHeight + BORDER_OFFSET;
		}
	},

	update: function () {
		if (this.death_throws == 0) {
			this.velocity.iAdd(this.acceleration);

			// Limit speed
			this.velocity.iLimit(MAX_SPEED);

			this.position.iAdd(this.velocity);
			this.bound();

			// Reset accelertion to 0 each cycle
			this.acceleration.iMultiplyBy(0);
		}
	},

	run: function (boids) {
		this.flock(boids);
		this.update();
		this.render();
	},

	set_death_throws: function () {
		this.death_throws = 50;
	},

	decrease_death_throws: function () {
		this.death_throws = this.death_throws - 1;
	},

	set_sabateur: function (b) {
		this.sabateur = b;
	},

}
	;
