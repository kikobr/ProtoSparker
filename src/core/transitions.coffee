module.exports =
	fade: (nav, layerA, layerB, overlay) ->
		transition =
			layerA:
				show:
					opacity: 1
					options:
						time: timeDefault
				hide:
					opacity: 0
					options:
						time: timeDefault
			layerB:
				show:
					opacity: 1
					options:
						time: timeDefault
				hide:
					opacity: 0
					options:
						time: timeDefault
	slideUp: (nav, layerA, layerB, overlay) ->
		transition =
			layerA:
				show:
					opacity: 1
					options:
						time: timeFast
				hide:
					opacity: 0.5
					options:
						time: timeFast
			layerB:
				show:
					y: 0
					opacity: 1
					options:
						time: timeDefault
				hide:
					y: 500
					opacity: 0
					options:
						time: timeDefault
	slideDown: (nav, layerA, layerB, overlay) ->
		transition =
			layerA:
				show:
					opacity: 1
					options:
						time: timeFast
				hide:
					opacity: 0.5
					options:
						time: timeFast
			layerB:
				show:
					y: 0
					opacity: 1
					options:
						time: timeDefault
				hide:
					y: -500
					opacity: 0
					options:
						time: timeDefault
	slideLeft: (nav, layerA, layerB, overlay) ->
		transition =
			layerA:
				show:
					opacity: 1
					options:
						time: timeFast
				hide:
					opacity: 0.5
					options:
						time: timeFast
			layerB:
				show:
					x: 0
					opacity: 1
					options:
						time: timeDefault
				hide:
					x: 500
					opacity: 0
					options:
						time: timeDefault
	slideRight: (nav, layerA, layerB, overlay) ->
		transition =
			layerA:
				show:
					opacity: 1
					options:
						time: timeFast
				hide:
					opacity: 0.5
					options:
						time: timeFast
			layerB:
				show:
					x: 0
					opacity: 1
					options:
						time: timeDefault
				hide:
					x: -500
					opacity: 0
					options:
						time: timeDefault
