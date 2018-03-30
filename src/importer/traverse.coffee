{getViewBox} = require './utils'

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
    createdLayer = null
    svg = node.closest 'svg'
    svgStr = ''
    svgBoundingClientRect = node.getBoundingClientRect()
    name = node.getAttribute 'data-name' or node.getAttribute 'id'
    skipChildren = false
    # qt = decodeMatrix node
    # computedStyle = getComputedStyle node
    viewBox = getViewBox node

    # get default layer params
    layerParams =
        name: name
        frame: {}
        backgroundColor: 'rgba(0,0,0,0.1)'
        x: Math.floor svgBoundingClientRect.x
        y: Math.floor svgBoundingClientRect.y
        width: Math.floor svgBoundingClientRect.width
        height: Math.floor svgBoundingClientRect.height
    # calculates relative position from parent's absolute position
    if parentLayer
        layerParams.x = layerParams.x - parentLayer.screenFrame.x
        layerParams.y = layerParams.y - parentLayer.screenFrame.y

    # this element will be used to store information that will be rendered inside layerParams.image
    layerSvg = document.createElement 'svg'
    layerSvg.setAttribute 'xmlns', "http://www.w3.org/2000/svg"
    layerSvg.setAttribute 'xmlns:xlink', "http://www.w3.org/1999/xlink"
    layerSvg.setAttribute 'style', 'svg {position: relative;} svg > * {position: absolute; top: 0; left: 0;}'

    if node.nodeName != 'g' and node.nodeName != 'use'
        console.log(layerSvg, node)

    # creating Framer layer
    layer = new Layer layerParams
    if parentLayer then layer.parent = parentLayer
    createdLayer = layer

    # continue traversing
    for child, i in node.children
        traverse child, node, createdLayer ? createdLayer : null
