loadFile = require './loadFile'
setupContainer = require './setupContainer'
traverse = require './traverse'

class exports.SvgImporter

    type: 'svg'
    loading: false
    svgContainer: null
    setupContainer: setupContainer

    constructor: (@options={ files: [] }) ->
        @files ?= @options.files
        return false if not @files
        @loading = true
        @setupContainer()
        @loadFile file, index for file, index in @files

    loadFile: (file, index) ->
        loadFile.call @, file, index
        svgTraverse = document.querySelector "[data-import-id='#{index}'] svg > g"

        # traversing
        traverse svgTraverse

        if index == @files.length - 1
            @loading = false
