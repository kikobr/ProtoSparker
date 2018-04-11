svgContainerStyle = require './style'

module.exports = () ->
    # create a container for the svgs
    @svgContainer = document.createElement 'div'
    @svgContainer.id = 'ps-importer-container'
    # if this div already exist, remove it to append the updated one
    # Framer Studio sometimes reload the script but keep the html intact
    if document.querySelector '#ps-importer-container'
        document.body.removeChild document.querySelector '#ps-importer-container'
    document.body.insertAdjacentElement 'afterbegin', @svgContainer

    # create style and classes for the svgContainer
    css = svgContainerStyle
    head = document.head or document.getElementsByTagName('head')[0]
    style = document.createElement 'style'
    style.setAttribute 'data-ps-importer', ''
    style.type = 'text/css'
    if style.styleSheet then style.styleSheet.cssText = css
    else style.appendChild(document.createTextNode css)

    if head.querySelector '[data-ps-importer]'
        head.removeChild head.querySelector '[data-ps-importer]'
    head.appendChild style
