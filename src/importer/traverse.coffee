{getViewBox, getUseDefs} = require './utils'

module.exports = traverse = (node, parent, parentLayer) ->

    # ignoring mask
    if node.nodeName == 'mask' or node.nodeName == 'clipPath' then return false

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
    computedStyle = getComputedStyle node
    isFirefox = if navigator.userAgent.indexOf("Firefox") > 0 then true else false
    # qt = decodeMatrix node

    # get default layer params
    layerParams =
        name: name
        frame: {}
        screenFrame: {}
        style: {}
        clip: false
        # backgroundColor: 'rgba(0,0,0,0.1)'
        x: Math.floor (nodeBounds.x or nodeBounds.left)
        y: Math.floor (nodeBounds.y or nodeBounds.top)
        width: Math.floor nodeBBox.width
        height: Math.floor nodeBBox.height
    # calculates relative position from parent's absolute position
    if parentLayer
        layerParams.x -= parentLayer.screenFrame.x
        layerParams.y -= parentLayer.screenFrame.y

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

    # some clip-paths are applied as classes
    if not isFirefox and (node.hasAttribute('clip-path') or (computedStyle.clipPath and computedStyle.clipPath != 'none'))

        url = node.getAttribute('clip-path') or computedStyle.clipPath
        # removes "" and ''
        url = url.replace('url("', 'url(').replace('url(\'', 'url(')
            .replace(/\"\)$/, ')').replace(/\'\)$/, ')')
        clipSelector = url.replace(/(^url\((.+)\)$)/, '$2')
        # apply the id selector if the url() didn't contain it before
        if clipSelector.substring(0,1) != '#' then clipSelector = "\##{clipSelector}"

        clipPath = svg.querySelector clipSelector
        clipPathInner = clipPath.querySelector(':scope > *') # path or rect usually

        clipPathBBox = clipPath.getBBox()
        clipPathBounds = clipPath.getBoundingClientRect()

        # if there's a path inside clipPath, consider that to calculate position,
        # since in webkit there's some bugs with getBBox on hidden elements
        if clipPathInner
            clipPathBBox = clipPathInner.getBBox()
            clipPathBounds = clipPathInner.getBoundingClientRect()

        layerParams.width = Math.ceil clipPathBBox.width
        layerParams.height = Math.ceil clipPathBBox.height

        # bug? some layers come with a wrong getBoundingClientRect(), like x: -2000.
        # trying to simplify with 0.
        layerParams.x = clipPathBounds.x or clipPathBounds.left
        layerParams.y = clipPathBounds.y or clipPathBounds.top
        if parentLayer
            layerParams.x -= parentLayer.screenFrame.x
            layerParams.y -= parentLayer.screenFrame.y

        # layerParams.x = 0
        # layerParams.y = 0
        layerParams.clip = true

        if clipPath.children.length == 1 and node.children[0].nodeName == 'path'
            path = node.children[0]
            layerParams.backgroundColor = path.getAttribute 'fill'

    if node.hasAttribute 'opacity' then layerParams.opacity = parseFloat node.getAttribute('opacity')

    if not isFirefox and node.closest('[mask]') and node.nodeName != 'g'
        ancestor = node.closest '[mask]'
        maskSelector = ancestor.getAttribute('mask').replace(/(^url\()(.+)(\)$)/, '$2')
        mask = svg.querySelector maskSelector
        for child in mask.querySelectorAll('*')
            if child.nodeName == 'use'
                defs = getUseDefs child
                layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
                try
                    child.setAttribute 'transform', "translate(#{-child.getBBox().x} #{-child.getBBox().y})"
                catch e then console.log "Error: #{e}"
        # apply mask attribute if node does not already have it
        for child in layerSvg.children
            if child.nodeName == node.nodeName
                if not child.hasAttribute 'mask' then child.setAttribute 'mask', "url(#{maskSelector})"
        # adds mask to layerSvg
        layerSvg.insertAdjacentElement 'afterbegin', mask.cloneNode(true)

    # TODO: print only the css required for the node to render. maybe render svg
    # style only one time, parse it and reuse it everytime to get the right string?
    if node.hasAttribute 'class'
        style = svg.querySelector('style')
        layerSvg.querySelector('defs').insertAdjacentElement 'afterbegin', style.cloneNode(true)

    ###
    # End of inner html
    ###

    # applies svg to image data
    layerParams.image = "data:image/svg+xml;charset=UTF-8,#{encodeURI layerSvg.outerHTML.replace(/\n|\t/g, ' ')}" # removes line breaks

    # creating Framer layer
    layer = new Layer layerParams
    if parentLayer then layer.parent = parentLayer
    createdLayer = layer

    # continue traversing
    for child, i in node.children
        traverse child, node, createdLayer ? createdLayer : null
