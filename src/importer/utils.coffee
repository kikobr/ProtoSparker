exports.getViewBox = getViewBox = (node) ->
    svg = node.closest 'svg'
    viewBox = svg.getAttribute 'viewBox'
    if not viewBox then return [0, 0, 0, 0]
    viewBox = viewBox.split(" ").map((item) -> return parseFloat item)
    return viewBox;

exports.getRootG = getRootG = (node) ->
    rootG = null
    svg = node.closest 'svg'
    for child in svg.children
        if(not rootG and child.nodeName == 'g')
            rootG = child
    return rootG
