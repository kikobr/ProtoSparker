###
= TODO LIST
###

# TODO: add hide / show elements
# TODO: setElement em mais de um elemento (setElement:el1;setElement:el2)
# TODO: permitir adicionar classes personalizadas a alguns text-fields / select-fields
# TODO: poder customizar transições
# TODO: poder customizar eventos
# TODO: push / pull layers
# TODO: melhorar o @actions para não precisar de hardcoded das ações nos métodos
# TODO QUESTION: condicionais para exibir ou não elemento?

exports.parse = parse = (string) ->

	# if actions are divided with spaces, ignore spaces "action1:target; action2:target;"
	string = string.replace(/;_/gi, ';')

	regexAction = /^(.*?)(?::|$)(.*?)(\[.*|$)/
	regexAction = /^(.*?(?=:|\[|$))(?::?)(.*?(?=\[.*)|.*$)(\[.*)?/
	regexOptions = /\[(.*?)\]$/
	regexOption = /(.*?)(\:|$)(.*)/

	# action:target[option:value, option:value];action:target;action;
	actions = []

	acts = string.split ';'
	acts.filter (action) ->
		matches = action.match regexAction
		action = matches[1]
		target = matches[2]
		options = []
		if matches[3]
			opts = matches[3].match(regexOptions)
			if opts[1]
				opts = opts[1].split(',')
			opts.forEach (opt) ->
				matches = opt.match regexOption
				name = matches[1]
				value = matches[3]
				options.push {
					name: name.trim()
					value: value.trim()
				}
		actions.push {
			action: action,
			target: target,
			options: options
		}

	return actions

timeDefault = 0.5
timeFast = 0.2
transitions =
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

class exports.ProtoSparker

	actions: []
	actionLayers: []

	defaultTextField:
		defaultClass: "ps-text-field"
		placeholderText: ""
		styles:
			default:
				field:
					"position": "absolute"
					"top": 0
					"left": 0
					"right": 0
					"bottom": 0
					"box-sizing": "border-box"
					"font-size": "14px"
					"background": "transparent"
					# "border": "1px solid red"
				placeholder: {}
	defaultSelectField:
		defaultClass: "ps-select-field"
		placeholderText: ""
		styles:
			default:
				field:
					"position": "absolute"
					"top": 0
					"left": 0
					"right": 0
					"bottom": 0
					"box-sizing": "border-box"
					"font-size": "14px"
					"background": "transparent"
					"-webkit-appearance": "none"
					"-moz-appearance": "none"
					"text-indent": "1px"
					"text-overflow": ""
					"border-radius": "0"
				placeholder: {}


	constructor: (@options={}) ->
		# Opts
		@options.firstPage ?= null

		@options.textField ?= {}
		@options.textField = _.merge @defaultTextField, @options.textField

		@options.selectField ?= {}
		@options.selectField = _.merge @defaultSelectField, @options.selectField

		@actions = [
			{ selector: "goback", fn: @goBack },
			{ selector: "goto:", fn: @goTo },
			{ selector: "overlay:", fn: @overlay },
			{ selector: "setElement:", fn: @setElement },
		]

		document.body.style.height = "auto"
		# body.scrollTop = 0

		default_w = @options.firstPage.width
		default_h = @options.firstPage.height
		screen_width = Framer.Device.screen.width
		screen_height = Framer.Device.screen.height

		# Something is fucked up when running the prototype on framer.cloud on chrome.
		# Prototype is seems to overflow window height.
		# I tried to solve this but I couldn't. Good luck.
		hackedScreenHeight = 0
		if window.location.origin.match('framer.cloud') and Utils.isMobile()
			hackedScreenHeight = 170
			screen_height -= hackedScreenHeight

		hRatio = screen_width / default_w
		vRatio = screen_height / default_h
		ratio = hRatio
		ratio = vRatio if vRatio < hRatio

		Framer.Defaults.Layer.force2d = true
		all = new Layer
			width: default_w  	# <-- The width will be 750
			height: default_h 	# <-- The height will be 1334
			scale: ratio 		# <-- The ratio we got from the equation
			originY: 0        	# <-- This moves the origin of scale to top left
			y: 0              	# <-- Make this layer to the top
			backgroundColor: "#000000"
		bg = new Layer
			width: screen_width
			height: screen_height
			y: 0
			x: 0
			backgroundColor: "#000000"
		bg.height += hackedScreenHeight

		all.parent = bg
		all.centerX()

		# Set up FlowComponent
		@flow = new FlowComponent
		@flow.width = @options.firstPage.width
		@flow.height = @options.firstPage.height
		@flow.parent = all
		@flow.showNext @options.firstPage

		# Get all layers that have actions
		@actions.forEach (action) =>
			layers = ff("*#{action.selector}*")
			@actionLayers = @actionLayers.concat layers

		#  break into commands separated by ; and run them in order
		@actionLayers.forEach (layer) =>
			layerFns = []
			layerActionsArray = layer.name.split(';')
			layerActionsArray.forEach (layerAction) =>
				# check if this layerAction matches a registered actionLayers
				@actions.forEach (action) =>
					if layerAction.match action.selector
						layerFns.push action.fn
			layer.onClick () =>
				layerFns.forEach (fn) =>
					fn.call this, layer

			layerName = @getLayerName layer
			actions = parse(layerName)
			overlayIndex = actions.findIndex (i) -> i.action == "overlay"
			if overlayIndex >= 0
				# hide overlay layers when prototype boots up
				action = actions[overlayIndex]
				destinationLayer = f(action.target)
				destinationLayer.visible = false

		@generateFields()
		@generateScrolls()
		@generateElements()

	testParser: ->
		print parse "action"
		print parse "action[op1, op2:2]"
		print parse "action:target"
		print parse "action:target[op1:1, op2:2, op3]"

	getLayerName: (layer) ->
		try
			layerName = layer.name
			# ignore suffix _123 on duplicates
			treatedLayerName = layerName.replace(/_[0-9]+$/, '')
			if f(treatedLayerName)
				layerName = treatedLayerName
			return layerName
		catch
			return false

	goBack: (layer) ->
		@flow.showPrevious()

	goTo: (layer) ->
		layerName = @getLayerName layer
		actions = parse(layerName).filter (action) ->
			return action.action == 'goto'
		action = actions[0]

		destinationLayer = f(action.target)
		destinationLayer.x = 0
		destinationLayer.y = 0

		transition = action.options.findIndex (i) -> i.name == "transition"
		if transition < 0
			transition = false

		if typeof transition == 'number' # this is the index
			transition = transitions[action.options[transition].value]
			@flow.transition destinationLayer, transition
		else
			@flow.showNext destinationLayer

	overlay: (layer) ->
		layerName = @getLayerName layer
		actions = parse(layerName).filter (action) ->
			return action.action == 'overlay'
		action = actions[0]
		destinationLayer = f(action.target)

		topIndex = action.options.findIndex (i) -> i.name == "top"
		rightIndex = action.options.findIndex (i) -> i.name == "right"
		bottomIndex = action.options.findIndex (i) -> i.name == "bottom"
		leftIndex = action.options.findIndex (i) -> i.name == "left"
		centerIndex = action.options.findIndex (i) -> i.name == "center"

		if topIndex >= 0
			@flow.showOverlayTop destinationLayer
		else if rightIndex >= 0
			@flow.showOverlayRight destinationLayer
		else if bottomIndex >= 0
			@flow.showOverlayBottom destinationLayer
		else if leftIndex >= 0
			@flow.showOverlayLeft destinationLayer
		else if centerIndex >= 0
			@flow.showOverlayCenter destinationLayer
		else
			@flow.showOverlayCenter destinationLayer

	toggleElement: (layer) ->
		layerName = @getLayerName layer
		actions = parse(layerName).filter (action) -> return action.action == 'element'
		action = actions[0] || null
		return if not action or not action.options.length

		elementName = action.target
		currentIndex = null
		nextElement = null
		defaultElement = null
		elementLayers = ff("*element:#{elementName},*element:#{elementName}*;,*element:#{elementName}[*")
		elementLayers.forEach (element, index) =>
			layerName = @getLayerName element
			actions = parse(layerName).filter (action) -> return action.action == 'element'
			action = actions[0] or null
			if action
				# for safety, save default element
				stateIndex = action.options.findIndex (i) -> i.name == "state"
				if not action.options[stateIndex] or action.options[stateIndex] and action.options[stateIndex].value == "default"
					defaultElement = element
				# try grabbing the next state
				if element == layer
					currentIndex = index

		if elementLayers[currentIndex+1]
			nextElement = elementLayers[currentIndex+1]
		else if elementLayers[currentIndex-1]
			nextElement = elementLayers[currentIndex-1]
		else
			nextElement = defaultElement

		if nextElement
			layerName = @getLayerName nextElement
			actions = parse(layerName).filter (action) -> return action.action == 'element'
			action = actions[0] || null
			@setElement nextElement, {
				action: "setElement",
				target: action.target
				options: action.options
			}

	setElement: (layer, action) ->
		# print "start"
		if not action
			layerName = @getLayerName layer
			actions = parse(layerName).filter (action) -> return action.action == 'setElement'
			action = actions[0] || null

		return if not action or not action.options.length
		stateIndex = action.options.findIndex (i) -> i.name == "state"

		if stateIndex < 0
			action.options.push({ name: "state", value: "default" })
			stateIndex = action.options.length - 1 # last one

		# Setting state
		if stateIndex >= 0
			state = action.options[stateIndex].value
			elementName = action.target

			# gets all element states that match this state and turn them on
			# elements that dont match this state are turned off
			hasMatch = false
			defaultElement = null
			ff("*element:#{elementName}*").forEach (element) =>
				layerName = @getLayerName element
				actions = parse(layerName).filter (action) -> return action.action == 'element'
				action = actions[0] or null
				return null if not action

				stateIndex = action.options.findIndex (i) -> i.name == "state"
				if not action.options[stateIndex] or action.options[stateIndex] and action.options[stateIndex].value == "default"
					defaultElement = element
				if stateIndex >= 0 and action.options[stateIndex].value == state
					hasMatch = true
					element.visible = true
				else
					element.visible = false
			# if no element was matched, fall back to default element
			if not hasMatch and defaultElement
				defaultElement.visible = true

	generateFields: ->
		css = ""

		# Generating Text Fields css for each styles
		for key, value of @options.textField.styles
			_class = key
			if _class == "default"
				_class = @options.textField.defaultClass
			fieldString = ""
			placeholderString = ""
			for _key, _value of value.field
				fieldString += "#{_key}:#{_value};"
			for _key, _value of value.placeholder
				placeholderString += "#{_key}:#{_value};"
			# adding placeHolder style
			css += "\
				.#{_class} 						   		{ #{fieldString} }\
				.#{_class}:focus						{ outline: none; }\
				.#{_class}::-webkit-input-placeholder 	{ #{placeholderString} }\
				.#{_class}::-moz-placeholder 			{ #{placeholderString} }\
				.#{_class}:-ms-input-placeholder 		{ #{placeholderString} }\
				.#{_class}::-ms-input-placeholder 		{ #{placeholderString} }\
				.#{_class}:placeholder-shown 			{ #{placeholderString} }\
			"

		# Generating Select Fields css for each styles
		for key, value of @options.selectField.styles
			# print key, value
			_class = key
			if _class == "default"
				_class = @options.selectField.defaultClass
			fieldString = ""
			placeholderString = ""
			for _key, _value of value.field
				fieldString += "#{_key}:#{_value};"
			for _key, _value of value.placeholder
				placeholderString += "#{_key}:#{_value};"
			# adding placeHolder style
			css += "\
				.#{_class} 						   		{ #{fieldString} }\
				.#{_class}:focus						{ outline: none; }\
				.#{_class}.empty						{ #{placeholderString} }\
			"

		# Creating style element
		head = document.head or document.getElementsByTagName('head')[0]
		style = document.createElement 'style'
		style.type = 'text/css'
		if style.styleSheet
			style.styleSheet.cssText = css;
		else
			style.appendChild(document.createTextNode(css));
		head.appendChild style

		# Generating text fields
		ff('text_field*').forEach (field) =>
			field.html = "<input placeholder=\"#{@options.textField.placeholderText}\" class=\"#{@options.textField.defaultClass}\" />"

		# Generating select boxes
		ff('select_field*').forEach (field, index) =>
			optString = "<option selected disabled style=\"color: red\">#{@options.selectField.placeholderText}</option>"

			layerName = @getLayerName field
			actions = parse(layerName).filter (action) -> return action.action == 'select_field'
			action = actions[0] || null

			if action
				for opt in action.options
					optString += "<option value=\"#{opt.value}\">#{opt.name.replace(/\_/g, ' ').trim()}</option>"

			field.html = "<select class=\"#{@options.selectField.defaultClass} empty\" onChange=\"this.classList.remove('empty');\">#{optString}</select>"

	generateScrolls: ->
		ff('scroll*').forEach (layer) =>
			layerName = @getLayerName layer

			actions = parse(layerName).filter (action) -> return action.action == 'scroll'
			action = actions[0]

			parent = layer.parent
			x = layer.x
			y = layer.y

			scroll = ScrollComponent.wrap layer
			scroll.parent = parent
			scroll.x = x
			scroll.y = y
			scroll.mouseWheelEnabled = true
			scroll.scrollVertical = false
			scroll.scrollHorizontal = false

			scroll.on Events.Scroll, (evt) ->
				return if not evt
				evt.preventDefault()
				evt.stopPropagation()
				evt.stopImmediatePropagation()

			if action and action.options and action.options.length
				if action.options[0].name == 'horizontal'
					scroll.scrollHorizontal = true
				if action.options[0].name == 'vertical'
					scroll.scrollHorizontal = true
			else
				# defaults to vertical scrolling
				scroll.scrollVertical = true

	generateElements: ->
		ff('*element:*').forEach (element) =>
			layerName = @getLayerName element
			action = parse(layerName)[0] || null
			return false if not action
			# get default state for this element
			elementName = action.target
			defaultElement = null

			# this distinguishes item-label and item-label-dark
			ff("*element:#{elementName},*element:#{elementName}*;,*element:#{elementName}[*").forEach (element) =>
				layerName = @getLayerName element
				action = parse(layerName)[0] || null
				if action
					stateIndex = action.options.findIndex (i) -> i.name == "state"
					if not action.options[stateIndex] or action.options[stateIndex] and action.options[stateIndex].value == "default"
						defaultElement = element
						return false

			toggleIndex = action.options.findIndex (i) -> i.name == "toggle"
			if action.options[toggleIndex]
				element.onClick =>
					@toggleElement element

			if defaultElement and defaultElement != element
				element.parent = defaultElement.parent
				element.placeBehind defaultElement
				element.x = defaultElement.x
				element.y = defaultElement.y
				element.visible = false

# f, ff
_getHierarchy = (layer) ->
  string = ''
  for a in layer.ancestors()
    string = a.name+'>'+string
  return string = string+layer.name

_match = (hierarchy, string) ->
  # prepare regex tokens
  string = string.replace(/\s*>\s*/g,'>') # clean up spaces around arrows
  string = string.split('*').join('[^>]*') # asteriks as layer name wildcard
  string = string.split(' ').join('(?:.*)>') # space as structure wildcard
  string = string.split(',').join('$|') # allow multiple searches using comma
  regexString = "(^|>)"+string+"$" # always bottom layer, maybe part of hierarchy

  regExp = new RegExp(regexString)
  return hierarchy.match(regExp)

_findAll = (selector, fromLayer) ->
  layers = Framer.CurrentContext._layers

  if selector?
    stringNeedsRegex = _.find ['*',' ','>',','], (c) -> _.includes selector,c
    unless stringNeedsRegex or fromLayer
      layers = _.filter layers, (layer) ->
        if layer.name is selector then true
    else
      layers = _.filter layers, (layer) ->
          hierarchy = _getHierarchy(layer)
          if fromLayer?
            _match(hierarchy, fromLayer.name+' '+selector)
          else
            _match(hierarchy, selector)
  else
    layers

f = exports.f = (selector, fromLayer) -> _findAll(selector, fromLayer)[0]
ff = exports.ff = (selector, fromLayer) -> _findAll(selector, fromLayer)
