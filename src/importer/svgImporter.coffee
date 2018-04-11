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
        hasRootG = if document.querySelectorAll("[data-import-id='#{index}'] svg > g").length == 1 then true else false

        # traversing
        if hasRootG
            for svgEl in svgTraverseEl
                traverse svgEl
        else
            traverse document.querySelector "[data-import-id='#{index}'] svg"

        if index == @files.length - 1
            @loading = false
