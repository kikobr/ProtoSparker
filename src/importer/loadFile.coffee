{getViewBox, getRootG} = require './utils'

module.exports = (file, index) ->
    console.log("loading #{file}")

    xhr = new XMLHttpRequest()
    xhr.open("GET", file, false)
    xhr.overrideMimeType "image/svg+xml"
    xhr.send null

    svg = xhr.responseXML.documentElement;

    fileFullName = xhr.responseURL.split('/').filter((item) ->
        # gets the part of url that contains the svg file
        if item.match '.svg'
            return true
        else
            return false
    )[0]
    fileName = fileFullName.replace '.svg', ''

    # gets root group and sets a name if it doesnt have one already
    rootG = getRootG svg
    if rootG and not rootG.hasAttribute('data-name') and not rootG.hasAttribute('id')
        rootG.setAttribute 'data-name', fileName

    if svg.getAttribute 'viewBox'
        viewBox = getViewBox.call this, svg
        if not svg.getAttribute('width') then svg.setAttribute('width', viewBox[2])
        if not svg.getAttribute('height') then svg.setAttribute('height', viewBox[3])

    importNode = document.createElement 'div'
    importNode.setAttribute 'data-import-id', index
    importNode.appendChild svg
    ###
        There's some bug when I import svgs. The first imported svg is fine,
        but the other ones start getting the sizes and positions messed up.
        Since I can't understand what is causing that, everytime I import svgs
        I put them at the first child, so that they stay with the right sizes
    ###
    @svgContainer.insertAdjacentElement 'afterbegin', importNode
