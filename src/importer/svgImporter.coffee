loadFile = require './loadFile'
setupContainer = require './setupContainer'
traverse = require './traverse'

module.exports = class SvgImporter

    type: 'svg'
    svgContainer: null
    setupContainer: setupContainer

    constructor: (@files=[]) ->
        return false if not @files
        @setupContainer()
        @loadFile file, index for file, index in @files

    loadFile: (file, index) ->
        loadFile.call @, file, index
        svgTraverse = document.querySelector "[data-import-id='#{index}'] svg > g"

        # traversing
        traverse svgTraverse
