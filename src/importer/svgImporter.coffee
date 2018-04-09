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
        @svgContainer.classList.add 'hidden'

    loadFile: (file, index) ->
        loadFile.call @, file, index
        svgTraverseEl = document.querySelectorAll "[data-import-id='#{index}'] svg > :not(defs):not(title):not(desc):not(style)"

        # traversing
        for svgEl in svgTraverseEl
            traverse svgEl

        if index == @files.length - 1
            @loading = false
