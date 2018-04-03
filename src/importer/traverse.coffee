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
    layerDefs = document.createElement 'defs'
    layerSvg.appendChild layerDefs



    ###
    # Generating inner html and applying transforms so that the svg
    # is rendered at 0,0 position of the layer
    ###

    if node.nodeName == 'use'
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height
        defs = getUseDefs node
        if defs then layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs

        inner = node.cloneNode()
        inner.setAttribute 'transform', "translate(#{-nodeBBox.x} #{-nodeBBox.y})"
        layerSvg.insertAdjacentElement 'afterbegin', inner
    else if node.nodeName != 'g' # dont clone child nodes because they will be traversed
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height

        inner = node.cloneNode(true)
        inner.setAttribute 'transform', "translate(#{-nodeBBox.x} #{-nodeBBox.y})"
        layerSvg.insertAdjacentElement 'afterbegin', inner

    ###
    # Extra layer info
    ###

    if node.hasAttribute 'opacity' then layerParams.opacity = parseFloat node.getAttribute('opacity')

    if node.closest('[mask]') and node.nodeName != 'g'
        ancestor = node.closest '[mask]'
        maskSelector = ancestor.getAttribute('mask').replace(/(^url\()(.+)(\)$)/, '$2')
        mask = svg.querySelector maskSelector
        for child in mask.querySelectorAll('*')
            if child.nodeName == 'use'
                defs = getUseDefs child
                layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
                child.setAttribute 'transform', "translate(#{-child.getBBox().x} #{-child.getBBox().y})"
        # apply mask attribute if node does not already have it
        for child in layerSvg.children
            if child.nodeName == node.nodeName
                if not child.hasAttribute 'mask' then child.setAttribute 'mask', "url(#{maskSelector})"
        # adds mask to layerSvg
        layerSvg.insertAdjacentElement 'afterbegin', mask.cloneNode(true)

    ###
    # End of inner html
    ###


    # applies svg to image data
    layerParams.image = "data:image/svg+xml;charset=UTF-8,#{layerSvg.outerHTML.replace(/\n/g, '')}" # removes line breaks

    # creating Framer layer
    layer = new Layer layerParams
    if parentLayer then layer.parent = parentLayer
    createdLayer = layer

    # continue traversing
    for child, i in node.children
        traverse child, node, createdLayer ? createdLayer : null
