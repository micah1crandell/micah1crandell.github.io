// All boid simulation based on https://www.nickfrosst.com/

function Obstacle(x,y,radius,repulsion, simulation) {
	this.position = new Vector(x,y)
	this.radius = radius
	this.simulation = simulation
	this.repulsion = repulsion

}

Obstacle.prototype = { 
		render: function() {
			this.simulation.ctx.beginPath();
			this.simulation.ctx.moveTo(this.position.x, this.position.y);
			this.simulation.ctx.strokeStyle = 'rgba(0, 195, 84, 0.8)';
			this.simulation.ctx.arc(this.position.x, this.position.y,this.radius,0,2*Math.PI);
			this.simulation.ctx.fillStyle = 'rgba(0, 195, 84, 0.8)';
			this.simulation.ctx.fill();
		},
}
