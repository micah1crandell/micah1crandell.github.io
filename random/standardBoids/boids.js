// All boid simulation based on https://www.nickfrosst.com/

$(function (name) {

	if (!checkForCanvasSupport()) {
		return;
	}

	resizeCanvas();

	var initialize_cavas_simulation = function (name, use_obstacle, avoid_mouse, click_to_add) {
		var simulation = new Simulation(name);
		simulation.initialize(use_obstacle, avoid_mouse);
		simulation.run();

		if (click_to_add) {
			$('canvas#' + name).click(function (e) {

				// No need to show the notice once the user has already added a boid
				var clickNotice$ = $('div#click_notice');
				clickNotice$.fadeOut('fast');

				var rect = this.getBoundingClientRect();
				var canvasX = e.clientX - rect.left;
				var canvasY = e.clientY - rect.top;

				boid = new Boid(canvasX, canvasY, simulation);
				simulation.addBoid(boid);

				return false;
			});
		}

		$('#reset_button_' + name).click(function (e) {
			simulation.initialize(use_obstacle, avoid_mouse);
			document.getElementById('num_sabateurs_' + name).value = 0;
		});

		$('canvas#' + name).mousemove(function (e) {
			var rect = this.getBoundingClientRect();
			simulation.update_mouse_position(e.clientX - rect.left, e.clientY - rect.top);
			return false;
		});

		$('#num_sabateurs_' + name).on('change',
			function (e) {
				console.log($(this).val())
				simulation.update_sabateurs($(this).val());
			});

		$('#separationMultiplier_' + name).on('change',
			function (e) {
				simulation.update_separationMultiplier($(this).val());
			});

		$('#cohesionMultiplier_' + name).on('change',
			function (e) {
				simulation.update_cohesionMultiplier($(this).val());
			});

		$('#alignmentMultiplier_' + name).on('change',
			function (e) {
				simulation.update_alignmentMultiplier($(this).val());
			});
	}
	initialize_cavas_simulation('boids1', false, true, true)
	//initialize_cavas_simulation('boids2',false, true, false)
	//initialize_cavas_simulation('boids4',true, true, false)

});
