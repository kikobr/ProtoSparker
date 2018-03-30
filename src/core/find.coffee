# f, ff
_getHierarchy = (layer) ->
	string = ''
	for a in layer.ancestors()
		# if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
		if a._info and a._info.originalName
			string = a._info.originalName+'>'+string
		else
			string = a.name+'>'+string

	# if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	if layer._info and layer._info.originalName
		string = string+layer._info.originalName
	else
		string = string+layer.name
	return string

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
		stringNeedsRegex = find ['*',' ','>',','], (c) -> includes selector,c
		unless stringNeedsRegex or fromLayer
			layers = filter layers, (layer) ->
				# if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
				if layer._info and layer._info.originalName
					if layer._info.originalName is selector then true
				else
					if layer.name is selector then true
		else
			layers = filter layers, (layer) ->
				hierarchy = _getHierarchy(layer)
				if fromLayer?
					# if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
					if fromLayer._info and fromLayer._info.originalName
						_match(hierarchy, fromLayer._info.originalName+' '+selector)
					else
						_match(hierarchy, fromLayer.name+' '+selector)
				else
					_match(hierarchy, selector)
	else
		layers

exports.f = (selector, fromLayer) -> _findAll(selector, fromLayer)[0]
exports.ff = (selector, fromLayer) -> _findAll(selector, fromLayer)
