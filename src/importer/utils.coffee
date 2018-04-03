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
