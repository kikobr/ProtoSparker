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

exports.getUseDefs = getUseDefs = (node) ->
    svg = node.closest "svg"
    linkedSelector = node.getAttribute "xlink:href"
    linked = svg.querySelectorAll linkedSelector
    defs = []
    for link in linked
        defs.push link.cloneNode()

    fillDefs = getFillDefs node
    if fillDefs then defs = defs.concat fillDefs # comes cloned
    return defs

exports.getFillDefs = getFillDefs = (node) ->
    defs = []
    if node.hasAttribute("fill") and node.getAttribute("fill").match("url")
        svg = node.closest "svg"
        fillUrl = node.getAttribute('fill').replace(/(^url\()(.+)(\)$)/, '$2')
        fill = svg.querySelector fillUrl
        defs.push fill.cloneNode(true)

        # get uses if this fill contains them
        if fill.querySelector 'use'
            uses = fill.querySelectorAll 'use'
            for use in uses
                useDefs = getUseDefs use
                if useDefs then defs = defs.concat useDefs # comes cloned
    return defs;

exports.getMatrixTransform = getMatrixTransform = (node) ->
    viewBox = getViewBox node

    rootG = getRootG node
    rootBounds = rootG.getBoundingClientRect()
    rootBBox = rootG.getBBox()
    rootT = rootG.getAttribute('transform').match(/translate\(([^)]+)\)/)
    if rootT
        rootT = rootT[1].split(" ").map (t) -> return parseFloat(t)

    if node.hasAttribute('transform') and node.getAttribute('transform').match('matrix')
        matrixArray = node.getAttribute('transform')
                                .replace(/(.*)matrix\((.*)\)(.*)/, '$2')
                                .split(' ')
                                .map((str) -> return parseFloat(str) )
        qrDecompose = (a) ->
            angle = Math.atan2(a[1], a[0])
            denom = Math.pow(a[0], 2) + Math.pow(a[1], 2)
            scaleX = Math.sqrt(denom)
            scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX
            skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom)
            return {
                angle: angle / (Math.PI / 180),  # this is rotation angle in degrees
                scaleX: scaleX,                  # scaleX factor
                scaleY: scaleY,                  # scaleY factor
                skewX: skewX / (Math.PI / 180),  # skewX angle degrees
                skewY: 0,                        # skewY angle degrees
                translateX: a[4] #- viewBox[0],   # translation point  x
                translateY: a[5] #- viewBox[1]    # translation point  y
                rootT: rootT
                rootBBox: rootBBox
                rootBounds: rootBounds
            };
        return qrDecompose matrixArray
