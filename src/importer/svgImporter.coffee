loadFile = require './loadFile'
setupContainer = require './setupContainer'
traverse = require './traverse'

class exports.SvgImporter

    type: 'svg'
    loading: false
    svgContainer: null
    files: []
    editableSvg: false
    setupContainer: setupContainer
    layerCount: 0,
    log: false

    constructor: (@options={ files: [], editableSvg: false, log: false }) ->
        @files = @options.files
        @editableSvg = @options.editableSvg
        @log = @options.log
        return false if not @files

        @loading = true
        @setupContainer()
        @loadFile file, index for file, index in @files
        @svgContainer.classList.add 'hidden'

    loadFile: (file, index) ->
        startTime = new Date() # start timer

        loadFile.call @, file, index
        svgTraverseEl = document.querySelectorAll "[data-import-id='#{index}'] svg > :not(defs):not(title):not(desc):not(style)"
        hasRootG = if document.querySelectorAll("[data-import-id='#{index}'] svg > g").length == 1 then true else false

        # traversing
        if hasRootG
            for svgEl in svgTraverseEl
                traverse.call this, svgEl
        else
            traverse.call this, document.querySelector "[data-import-id='#{index}'] svg"

        if index == @files.length - 1
            @loading = false

        diffTime = (new Date().getTime() - startTime.getTime()) / 1000
        if @log then console.log "Loaded #{file} in #{diffTime} seconds"
