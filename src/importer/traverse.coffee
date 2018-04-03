{getViewBox, getUseDefs} = require './utils'

module.exports = traverse = (node, parent, parentLayer) ->

    # ignoring mask
    if node.nodeName == 'mask' then return false

    # setting active classes to hidden layers so that we can calculate getBoundingClientRect() correctly
    if node.parentNode and node.parentNode.nodeName == 'svg'
        importId = node.closest('[data-import-id]').getAttribute('data-import-id')
        document.querySelectorAll("#svgContainer > [data-import-id]").forEach (el) ->
            if el.getAttribute 'data-import-id' == importId then el.classList.add 'active'
            else el.classList.remove 'active'

    # main variables
    viewBox = getViewBox node
    createdLayer = null
    svg = node.closest 'svg'
    svgStr = ''
    nodeBounds = node.getBoundingClientRect()
    nodeBBox = node.getBBox()
    name = if node.getAttribute 'data-name' then node.getAttribute 'data-name' else node.id
    skipChildren = false
    # qt = decodeMatrix node
    # computedStyle = getComputedStyle node

    # get default layer params
    layerParams =
        name: name
        frame: {}
        style: {}
        # backgroundColor: 'rgba(0,0,0,0.1)'
        x: Math.floor nodeBounds.x
        y: Math.floor nodeBounds.y
        width: Math.floor nodeBBox.width
        height: Math.floor nodeBBox.height
    # calculates relative position from parent's absolute position
    if parentLayer
        layerParams.x = layerParams.x - parentLayer.screenFrame.x
        layerParams.y = layerParams.y - parentLayer.screenFrame.y


    # this element will be used to store information that will be rendered inside layerParams.image
    layerSvg = document.createElement 'svg'
    layerSvg.setAttribute 'xmlns', "http://www.w3.org/2000/svg"
    layerSvg.setAttribute 'xmlns:xlink', "http://www.w3.org/1999/xlink"
    layerSvg.setAttribute 'style', 'position: relative; display: block;'
    # layerSvg.setAttribute 'style', 'svg {position: relative;} svg > * {position: absolute; top: 0; left: 0;}'

    layerDefs = document.createElement 'defs'
    layerSvg.appendChild layerDefs



    ###
    # Generating inner svg
    ###

    if node.nodeName == 'use'
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height

        defs = getUseDefs node
        inner = node.cloneNode()

        inner.setAttribute 'transform', "translate(#{-nodeBBox.x} #{-nodeBBox.y})"
        layerSvg.insertAdjacentElement 'afterbegin', inner
        if defs
            layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs


    else if node.nodeName != 'use'
        if name == 'yellow'
            console.log node.getBBox()
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height

        inner = node.cloneNode(true)
        inner.setAttribute 'transform', "translate(#{-nodeBBox.x} #{-nodeBBox.y})"
        layerSvg.insertAdjacentElement 'afterbegin', inner
        # document.body.appendChild layerSvg
        # console.log layerParams)


    layerParams.image = "data:image/svg+xml;charset=UTF-8,#{layerSvg.outerHTML.replace(/\n/g, '')}" # removes line breaks



    # creating Framer layer
    layer = new Layer layerParams
    if parentLayer then layer.parent = parentLayer
    createdLayer = layer

    # continue traversing
    for child, i in node.children
        traverse child, node, createdLayer ? createdLayer : null
