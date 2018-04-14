{getViewBox, getUseDefs, getMatrixTransform} = require './utils'

module.exports = traverse = (node, parent, parentLayer) ->

    # ignoring
    if node.nodeName == 'mask' or
        node.nodeName == 'clipPath' or
        node.nodeName == 'use' and node.parentNode.children.length == 1
            return false

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
    nodeBBox = if node.getBBox then node.getBBox() else { x: 0, y: 0 }
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
        style: {
            'background-repeat': 'no-repeat'
            'background-position': 'top left'
            'background-size': 'auto'
        }
        clip: false
        backgroundColor: 'transparent'
        x: (nodeBounds.x or nodeBounds.left)
        y: (nodeBounds.y or nodeBounds.top)
        originX: 0.5,
        originY: 0.5,
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

    # groups that has only simple shapes may be rendered as just one framer layer.
    # if node.nodeName == 'g' and node.querySelectorAll(':scope > circle').length == node.children.length then skipChildren = true

    if node.nodeName == 'g' and node.children.length == 1 and node.children[0].nodeName == 'use'
        use = node.children[0]
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height
        defs = getUseDefs use
        if defs then layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
        useBBox = use.getBBox()
        useBounds = use.getBoundingClientRect()
        tX = -useBBox.x
        tY = -useBBox.y
        toX = (useBBox.width / 2)
        toY = (useBBox.height / 2)

        [rotate, rotateX, rotateY] = [0,0,0]
        [scaleX, scaleY] = [1,1]
        qt = getMatrixTransform use

        if qt
            if qt.angle
                toX += (nodeBBox.x - qt.translateX) + (useBounds.width - useBBox.width)
                toY += (nodeBBox.y - qt.translateY) + (useBounds.height - useBBox.height)
                rotate = qt.angle
                rotateX = (useBBox.width / 2) + useBBox.x - toX
                rotateY = (useBBox.height / 2) + useBBox.y - toY
            tX += ((nodeBBox.width - useBBox.width) / 2 )
            tY += ((nodeBBox.height - useBBox.height) / 2 )
            scaleX = qt.scaleX
            scaleY = qt.scaleY

        inner = node.cloneNode(true)
        # inner.children[0].setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}) scale(#{scaleX} #{scaleY})"
        # inner.children[0].setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX + rotateX}px #{toY + rotateY}px")
        currentStyle = inner.children[0].getAttribute('style') or ''
        currentStyle = currentStyle.replace('transform', '_transform')
        inner.children[0].removeAttribute 'transform'
        inner.children[0].removeAttribute 'transform-origin'
        inner.children[0].setAttribute 'style', "#{currentStyle}; transform-origin: #{toX + rotateX}px #{toY + rotateY}px; transform: translate(#{tX}px, #{tY}px) rotate(#{rotate}deg) scale(#{scaleX}, #{scaleY});"

        # inner.children[0].setAttribute("transform-origin", "#{toX} #{toY}")
        # inner.children[0].style['transformOrigin'] = "#{toX} #{toY}"
        # inner.children[0].setAttributeNS("http://www.w3.org/2000/svg", "style", "transform-origin: \"#{toX} #{toY}\";")
        layerSvg.insertAdjacentElement 'afterbegin', inner

    if node.nodeName == 'use'
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height
        defs = getUseDefs node
        if defs then layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
        tX = -nodeBBox.x
        tY = -nodeBBox.y
        toX = (nodeBBox.width / 2)
        toY = (nodeBBox.height / 2)

        [rotate, rotateX, rotateY] = [0,0,0]
        [scaleX, scaleY] = [1,1]

        if qt
            if qt.angle
                toX += (nodeBounds.width - nodeBBox.width)
                toY += (nodeBounds.height - nodeBBox.height)
                rotate = qt.angle
                rotateX = (nodeBBox.width / 2) + nodeBBox.x - toX
                rotateY = (nodeBBox.height / 2) + nodeBBox.y - toY
            # compensate origin distortion when nodeBBox.width differs from nodeBounds.width (scale + translate together)
            tX += (nodeBounds.width - nodeBBox.width) / 2
            tY += (nodeBounds.height - nodeBBox.height) / 2
            scaleX = qt.scaleX
            scaleY = qt.scaleY

        inner = node.cloneNode()
        # inner.setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY}) scale(#{scaleX} #{scaleY})"
        # inner.setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX} #{toY}");
        currentStyle = inner.getAttribute('style') or ''
        currentStyle = currentStyle.replace('transform', '_transform')
        inner.removeAttribute 'transform'
        inner.removeAttribute 'transform-origin'
        inner.setAttribute 'style', "#{currentStyle}; transform-origin: #{toX + rotateX}px #{toY + rotateY}px; transform: translate(#{tX}px, #{tY}px) rotate(#{rotate}deg) scale(#{scaleX}, #{scaleY});"
        layerSvg.insertAdjacentElement 'afterbegin', inner

    # else if node.nodeName == 'g'
    #     # these groups do not render any svg
    #     if qt and qt.angle
    #         layerParams.rotation = qt.angle

    else if node.nodeName != 'g' or (node.nodeName == 'g' and skipChildren)
        tX = -nodeBBox.x
        tY = -nodeBBox.y
        [rotate, rotateX, rotateY] = [0,0,0]
        [scaleX, scaleY] = [1,1]
        toX = (nodeBBox.width / 2)
        toY = (nodeBBox.height / 2)
        layerSvg.setAttribute 'width', nodeBBox.width
        layerSvg.setAttribute 'height', nodeBBox.height

        defs = getUseDefs node
        if defs then layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs

        # check if theres a g ancestor applying a rotation
        ancestorT = node.parentNode.closest('[transform]')
        if ancestorT
            t = getMatrixTransform ancestorT
            if t.angle
                rotate += t.angle

        if qt
            if qt.angle
                toX += (nodeBounds.width - nodeBBox.width)
                toY += (nodeBounds.height - nodeBBox.height)
                rotate += qt.angle
                rotateX += (nodeBBox.width / 2) + nodeBBox.x - toX
                rotateY += (nodeBBox.height / 2) + nodeBBox.y - toY
            scaleX = qt.scaleX
            scaleY = qt.scaleY
            # compensate origin distortion when nodeBBox.width differs from nodeBounds.width (scale + translate together)
            tX += (nodeBounds.width - nodeBBox.width) / 2
            tY += (nodeBounds.height - nodeBBox.height) / 2

        inner = node.cloneNode(true)
        # inner.setAttribute 'transform', "translate(#{tX} #{tY}) rotate(#{rotate}, #{rotateX}, #{rotateY}) scale(#{scaleX} #{scaleY})"
        # inner.setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX} #{toY}");
        currentStyle = inner.getAttribute('style') or ''
        currentStyle = currentStyle.replace('transform', '_transform')
        inner.removeAttribute 'transform'
        inner.removeAttribute 'transform-origin'
        inner.setAttribute 'style', "#{currentStyle}; transform-origin: #{toX + rotateX}px #{toY + rotateY}px; transform: translate(#{tX}px, #{tY}px) rotate(#{rotate}deg) scale(#{scaleX}, #{scaleY});"

        layerSvg.insertAdjacentElement 'afterbegin', inner

    ###
    # Extra layer info
    ###

    if node.hasAttribute('fill') or (computedStyle.fill and computedStyle.fill != 'none')
        fill = node.getAttribute('fill') or computedStyle.fill
        if fill.match('url')
            # removes "" and ''
            url = fill.replace('url("', 'url(').replace('url(\'', 'url(')
                .replace(/\"\)$/, ')').replace(/\'\)$/, ')')
            fillSelector = url.replace(/(^url\((.+)\)$)/, '$2')
            # apply the id selector if the url() didn't contain it before
            if fillSelector.substring(0,1) != '#' then fillSelector = "\##{fillSelector}"

            fill = svg.querySelector fillSelector
            layerSvg.querySelector('defs').insertAdjacentElement 'beforeend', fill.cloneNode(true)
    else
        # get node inside layerSvg and set a fill transparent
        for child in layerSvg.children
            if child.nodeName == node.nodeName
                child.setAttribute 'fill', 'transparent'

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
        clipPathInnerBBox = null

        clipPathBBox = clipPath.getBBox()
        clipPathBounds = clipPath.getBoundingClientRect()

        # if there's a path inside clipPath, consider that to calculate position,
        # since in webkit there's some bugs with getBBox on hidden elements
        if clipPathInner
            clipPathInnerBBox = clipPathInner.getBBox()
            clipPathBBox = clipPathInnerBBox
            clipPathBounds = clipPathInner.getBoundingClientRect()

        layerParams.width = clipPathBBox.width
        layerParams.height = clipPathBBox.height

        # bug? some layers come with a wrong getBoundingClientRect(), like x: -2000.
        # trying to simplify with 0.
        if clipPathInner and clipPathInnerBBox and clipPathInnerBBox.x == 0 and clipPathInnerBBox.y == 0
            layerParams.x = 0
            layerParams.y = 0
        else
            layerParams.x = clipPathBounds.x or clipPathBounds.left
            layerParams.y = clipPathBounds.y or clipPathBounds.top
            if parentLayer
                layerParams.x -= parentLayer.screenFrame.x
                layerParams.y -= parentLayer.screenFrame.y

        if qt
            layerParams.x += qt.translateX
            layerParams.y += qt.translateY

        # layerParams.x = 0
        # layerParams.y = 0
        layerParams.clip = true

        if clipPath.children.length == 1 and node.children.length == 1 and node.children[0].nodeName == 'path'
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
            if child.nodeName == 'use' or child.nodeName == 'rect' or child.nodeName == 'path'
                defs = getUseDefs child
                layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def) for def in defs
                childBBox = child.getBBox()
                childBounds = child.getBoundingClientRect()
                childOriginalT = child.getAttribute('transform') and child.getAttribute('transform').match(/translate\(([^)]+)\)/)
                linkedSelector = child.getAttribute "xlink:href"
                linked = svg.querySelectorAll(linkedSelector)[0]

                childTx = (childBounds.x or childBounds.left)
                childTy = (childBounds.y or childBounds.top)
                [rotate, rotateX, rotateY] = [0,0,0]
                [scaleX, scaleY] = [1,1]

                toX = (childBBox.width / 2)
                toY = (childBBox.height / 2)

                if parentLayer
                    childTx -= parentLayer.screenFrame.x
                    childTy -= parentLayer.screenFrame.y

                if node.nodeName == 'g' and node.parentNode and node.parentNode.nodeName == 'g'
                    parentNodeBBox = node.parentNode.getBBox()
                    childTx += parentNodeBBox.x - nodeBBox.x - childBBox.x
                    childTy += parentNodeBBox.y - nodeBBox.y - childBBox.y
                else
                    childTx = nodeBBox.x - childBBox.x
                    childTy = nodeBBox.y - childBBox.y

                # apply transforms over the clone, not the original svg
                childClone = maskClone.querySelectorAll('*')[index]
                # childClone.setAttribute 'transform', "translate(#{childTx} #{childTy}) rotate(#{rotate}, #{rotateX}, #{rotateY}) scale(#{scaleX} #{scaleY})"
                # childClone.setAttributeNS("http://www.w3.org/2000/svg", "transform-origin", "#{toX} #{toY}")
                currentStyle = childClone.getAttribute('style') or ''
                currentStyle = currentStyle.replace('transform', '_transform')
                childClone.removeAttribute 'transform'
                childClone.removeAttribute 'transform-origin'
                childClone.setAttribute 'style', "#{currentStyle}; transform-origin: #{toX + rotateX}px #{toY + rotateY}px; transform: translate(#{childTx}px, #{childTy}px) rotate(#{rotate}deg) scale(#{scaleX}, #{scaleY});"

        # apply mask attribute if node does not already have it
        for child in layerSvg.children
            if child.nodeName == node.nodeName
                if node.hasAttribute 'transform'
                    # encapsulate with g if the layer has a transform, so that the mask isnt affected
                    g = document.createElement 'g'
                    layerSvg.removeChild child
                    g.appendChild child
                    g.setAttribute 'mask', "url(#{maskSelector})"
                    layerSvg.insertAdjacentElement 'afterbegin', g
                else if not child.hasAttribute 'mask' then child.setAttribute 'mask', "url(#{maskSelector})"
        # adds mask to layerSvg
        layerSvg.insertAdjacentElement 'afterbegin', maskClone

    # TODO: print only the css required for the node to render. maybe render svg
    # style only one time, parse it and reuse it everytime to get the right string?
    if node.hasAttribute 'class'
        style = svg.querySelector('style')
        if style then layerSvg.querySelector('defs').insertAdjacentElement 'afterbegin', style.cloneNode(true)

    if node.nodeName == 'line'
        layerSvg.removeAttribute 'height'
        strokeWidth = if computedStyle['stroke-width'] then parseFloat computedStyle['stroke-width'].replace('px','') else 1
        layerParams.height += strokeWidth

    ###
    # End of inner html
    ###

    # applies svg to image data
    layerParams.image = "data:image/svg+xml;charset=UTF-8,#{
        encodeURI layerSvg.outerHTML.replace(/\n|\t/g, ' ')  # removes line breaks
            .replace(/\"/g, "\\\"")
            .replace(/\'/g, "\\'")
    }"
    layerParams.height = Math.ceil layerParams.height
    layerParams.width = Math.ceil layerParams.width

    if node.nodeName == 'svg'
        layerParams.x = nodeBounds.x or nodeBounds.left
        layerParams.y = nodeBounds.y or nodeBounds.top
        layerParams.width = nodeBounds.width
        layerParams.height = nodeBounds.height
        layerParams.clip = true

    # creating Framer layer
    if node.id and node.getAttribute('name')
        ###
            There's a bug when loading multiple SVG's whose defs contents are
            repeated ids. xlink:href can't link to the right path. Maybe the
            solution would be trying to isolate these SVGs? creating an external
            file for each one?
        ###
        layerParams.image = ''
        for child, index in layerSvg.children
            if not child.nodeName.match(/defs/gi) and child.nodeName != 'style'
                if child.id then child.setAttribute 'name', child.id
                else
                    child.id = index
                    child.setAttribute 'name', index
        layerParams.svg = layerSvg.outerHTML.replace(/\n|\t/g, ' ')
        layer = new SVGLayer layerParams
        if parentLayer then layer.parent = parentLayer
        createdLayer = layer
    else
        layer = new Layer layerParams
        if parentLayer then layer.parent = parentLayer
        createdLayer = layer

    # if name == 'path1' or name == 'path2' or name == 'path3' or name == 'path4'
    #     layer.style['border'] = '1px solid green'
    #     console.log layer.image
    #     console.log node.outerHTML
    #     console.log '___'

    # continue traversing
    if not skipChildren
        for child, i in node.children
            traverse child, node, createdLayer ? createdLayer : null
