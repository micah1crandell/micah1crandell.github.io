// All boid simulation based on https://www.nickfrosst.com/

$(function (name) {

	if (!checkForCanvasSupport()) {
		return;
	}

	resizeCanvas();

	var initialize_cavas_simulation = function (name, use_obstacle, avoid_mouse) {
		var simulation = new Simulation(name);
		simulation.initialize(use_obstacle, avoid_mouse);
		simulation.run();

        var initialize_cavas_simulation = function (name, use_obstacle, avoid_mouse) {
            var simulation = new Simulation(name);
            simulation.initialize(use_obstacle, avoid_mouse);
            simulation.run();
    
            // Remove click-to-add-boid functionality
            $('canvas#' + name).off('click');
    
            $('#reset_button_' + name).click(function (e) {
                simulation.initialize(use_obstacle, avoid_mouse);
            });
        };

		$('canvas#' + name).mousemove(function (e) {
			var rect = this.getBoundingClientRect();
			simulation.update_mouse_position(e.clientX - rect.left, e.clientY - rect.top);
			return false;
		});

		$(window).on('resize', function () {
			resizeCanvas();
			simulation.canvasWidth = window.innerWidth;
			simulation.canvasHeight = window.innerHeight;
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
	initialize_cavas_simulation('boids1', false, true)

});
