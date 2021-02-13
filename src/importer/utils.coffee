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
    if !rootG
        rootG = svg
    return rootG

exports.getUseDefs = getUseDefs = (node) ->
    # if node.nodeName != 'use' then return false
    svg = node.closest "svg"
    defs = []

    linkedSelector = node.getAttribute "xlink:href"
    if linkedSelector && not linkedSelector.match('data:') && not linkedSelector.match('/')
        linked = svg.querySelectorAll linkedSelector
        for link in linked
            defs.push link.cloneNode()

    fillDefs = getFillDefs node
    if fillDefs then defs = defs.concat fillDefs # comes cloned
    strokeDefs = getStrokeDefs node
    if strokeDefs then defs = defs.concat strokeDefs # comes cloned

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

exports.getStrokeDefs = getStrokeDefs = (node) ->
    defs = []
    if node.hasAttribute("stroke") and node.getAttribute("stroke").match("url")
        svg = node.closest "svg"
        strokeUrl = node.getAttribute('stroke').replace(/(^url\()(.+)(\)$)/, '$2')
        stroke = svg.querySelector strokeUrl
        defs.push stroke.cloneNode(true)

        # get uses if this fill contains them
        if stroke.querySelector 'use'
            uses = stroke.querySelectorAll 'use'
            for use in uses
                useDefs = getUseDefs use
                if useDefs then defs = defs.concat useDefs # comes cloned
    return defs;

exports.getMatrixTransform = getMatrixTransform = (node, log=false) ->
    viewBox = getViewBox node

    rootG = getRootG node
    rootBounds = rootG.getBoundingClientRect()
    rootBBox = rootG.getBBox()
    rootT = if rootG.getAttribute('transform') then rootG.getAttribute('transform').match(/translate\(([^)]+)\)/) else false
    if rootT
        rootT = rootT[1].split(" ").map (t) -> return parseFloat(t)
    if node.hasAttribute('transform') and node.getAttribute('transform').match('matrix')
        matrixArray = node.getAttribute('transform')
                                .replace(/(.*)matrix\((.*)\)(.*)/, '$2')
                                .replace(/\,\ /g, ' ') # matrix(0, 0, 0, 0, 0, 0)
                                .replace(/\,/g, ' ') # matrix(0,0,0,0,0,0)
                                .split(' ') # matrix(0 0 0 0 0 0)
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
        if log
            console.log 'matrix', matrixArray
            console.log node.getAttribute 'transform'
        return qrDecompose matrixArray
    else if node.hasAttribute('transform')
        nodeT = node.getAttribute('transform')
        transform =
            angle: 0,
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0
        translate = nodeT.match(/translate\(([^)]+)\)/)
        if translate and translate.length
            translate = translate[1].split(" ").map((t) -> return parseFloat t)
            transform.translateX = translate[0]
            transform.translateY = translate[1]
        rotate = nodeT.match(/rotate\(([^)]+)\)/)
        if rotate and rotate.length
            rotate = rotate[1].split(" ").map((t) -> return parseFloat t)
            transform.angle = parseFloat rotate[0]
        return transform
    else return false
