svgContainerStyle = require './style'

module.exports = () ->
    # create a container for the svgs
    @svgContainer = document.createElement 'div'
    @svgContainer.id = 'svgContainer'
    document.body.appendChild @svgContainer

    # create style and classes for the svgContainer
    css = svgContainerStyle
    head = document.head or document.getElementsByTagName('head')[0]
    style = document.createElement 'style'
    style.type = 'text/css'
    if style.styleSheet then style.styleSheet.cssText = css
    else style.appendChild(document.createTextNode css)
    head.appendChild style
