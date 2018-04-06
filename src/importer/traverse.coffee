{getViewBox, getUseDefs, getMatrixTransform} = require './utils'

module.exports = traverse = (node, parent, parentLayer) ->

    # ignoring
    if node.nodeName == 'mask' or
        node.nodeName == 'clipPath' or
        node.nodeName == 'use' and node.parentNode.children.length == 1 then return false

    # setting active classes to hidden layers so that we can calculate getBoundingClientRect() correctly
    if node.parentNode and node.parentNode.nodeName == 'svg'
        importId = node.closest('[data-import-id]').getAttribute('data-import-id')
        document.querySelectorAll("#ps-importer-container > [data-import-id]").forEach (el) ->
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
    qt = getMatrixTransform node

    # get default layer params
    layerParams =
        name: name
        frame: {}
        screenFrame: {}
        style: {}
        clip: false
        # backgroundColor: 'rgba(0,0,0,0.1)'
        x: (nodeBounds.x or nodeBounds.left)
        y: (nodeBounds.y or nodeBounds.top)
        width: nodeBBox.width
        height: nodeBBox.height

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

    if node.nodeName == 'g' and node.children.length == 1 and node.children[0].nodeName == 'use'
        use = node.children[0]
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height
        defs = getUseDefs use
        if defs then layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
        useBBox = use.getBBox()
        tX = -useBBox.x
        tY = -useBBox.y

        [rotate, rotateX, rotateY] = [0,0,0]
        qt = getMatrixTransform use
        if qt and qt.angle
            rotate = qt.angle
            rotateX = (useBBox.width / 2) + useBBox.x
            rotateY = (useBBox.height / 2) + useBBox.y
            tX += ((nodeBBox.width - useBBox.width) / 2 )
            tY += ((nodeBBox.height - useBBox.height) / 2 )

        inner = node.cloneNode(true)
        inner.children[0].setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY})"
        layerSvg.insertAdjacentElement 'afterbegin', inner

    if node.nodeName == 'use'
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height
        defs = getUseDefs node
        if defs then layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
        tX = -nodeBBox.x
        tY = -nodeBBox.y
        [rotate, rotateX, rotateY] = [0,0,0]

        if qt and qt.angle
            rotate = qt.angle
            rotateX = layerParams.width / 2
            rotateY = layerParams.height / 2

        inner = node.cloneNode()
        inner.setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY})"
        layerSvg.insertAdjacentElement 'afterbegin', inner

    else if node.nodeName != 'g'
        tX = -nodeBBox.x
        tY = -nodeBBox.y
        [rotate, rotateX, rotateY] = [0,0,0]

        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height

        inner = node.cloneNode(true)
        inner.setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY})"
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

        layerParams.width = clipPathBBox.width
        layerParams.height = clipPathBBox.height

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

        if clipPath.children.length == 1 and node.children[0] and node.children[0].nodeName == 'path'
            path = node.children[0]
            layerParams.backgroundColor = path.getAttribute 'fill'

    if node.hasAttribute 'opacity' then layerParams.opacity = parseFloat node.getAttribute('opacity')

    if node.hasAttribute 'filter'
        filterSelector = node.getAttribute('filter').replace(/(^url\()(.+)(\)$)/, '$2')
        filter = svg.querySelector filterSelector
        filterClone = filter.cloneNode(true)
        layerSvg.querySelector('defs').insertAdjacentElement 'beforeend', filterClone
        # since filter is not working yet, disable it
        for child in layerSvg.children
            if child.nodeName == node.nodeName
                child.removeAttribute 'filter'

    if not isFirefox and node.closest('[mask]')
        ancestor = node.closest '[mask]'
        maskSelector = ancestor.getAttribute('mask').replace(/(^url\()(.+)(\)$)/, '$2')
        mask = svg.querySelector maskSelector
        maskClone = mask.cloneNode true

        useBBox = null
        if node.nodeName == 'g' and node.children.length == 1 and node.children[0].nodeName == 'use'
            use = node.children[0]
            useBBox = use.getBBox()

        for child, index in mask.querySelectorAll('*')
            if child.nodeName == 'use'
                defs = getUseDefs child
                layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
                childBBox = child.getBBox()
                childBounds = child.getBoundingClientRect()
                childOriginalT = child.getAttribute('transform') and child.getAttribute('transform').match(/translate\(([^)]+)\)/)

                childTx = (childBounds.x or childBounds.left)
                childTy = (childBounds.y or childBounds.top)
                [rotate, rotateX, rotateY] = [0,0,0]

                linkedSelector = child.getAttribute "xlink:href"
                linked = svg.querySelectorAll(linkedSelector)[0]

                if parentLayer
                    childTx -= parentLayer.screenFrame.x
                    childTy -= parentLayer.screenFrame.y

                if node.nodeName == 'g' and node.children.length == 1 and node.children[0].nodeName == 'use' then ''
                else if nodeBBox
                    childTx += nodeBBox.x
                    childTy += nodeBBox.y

                # apply transforms over the clone, not the original svg
                childClone = maskClone.querySelectorAll('*')[index]
                childClone.setAttribute 'transform', "translate(#{childTx} #{childTy}) rotate(#{rotate}, #{rotateX}, #{rotateY})"

        # apply mask attribute if node does not already have it
        for child in layerSvg.children
            if child.nodeName == node.nodeName
                if not child.hasAttribute 'mask' then child.setAttribute 'mask', "url(#{maskSelector})"
        # adds mask to layerSvg
        layerSvg.insertAdjacentElement 'afterbegin', maskClone


    # TODO: print only the css required for the node to render. maybe render svg
    # style only one time, parse it and reuse it everytime to get the right string?
    if node.hasAttribute 'class'
        style = svg.querySelector('style')
        layerSvg.querySelector('defs').insertAdjacentElement 'afterbegin', style.cloneNode(true)

    # apply transformations that had matrix transforms
    if qt
        if qt.scaleX != 1 or qt.scaleY != 1
            layerParams.scaleX = qt.scaleX
            layerParams.scaleY = qt.scaleY

    ###
    # End of inner html
    ###

    # applies svg to image data
    layerParams.image = "data:image/svg+xml;charset=UTF-8,#{encodeURI layerSvg.outerHTML.replace(/\n|\t/g, ' ')}" # removes line breaks

    # for debug purposes
    # layerParams.backgroundColor = "rgba(255,255,255,0.05)"
    # layerParams.style['border'] = "1px solid rgba(255,255,255,0.1)"
    # layerParams.image = ''

    # creating Framer layer
    layer = new Layer layerParams
    if parentLayer then layer.parent = parentLayer
    createdLayer = layer

    # continue traversing
    for child, i in node.children
        traverse child, node, createdLayer ? createdLayer : null
