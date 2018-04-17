module.exports = """
    html, body {
        margin: 0;
        padding: 0;
    }
    #ps-importer-container {
        visibility: hidden;
        display: block;
        position: relative;
        z-index: 999;
    }
    #ps-importer-container.hidden {
        display: none;
    }
    #ps-importer-container [data-import-id] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    #ps-importer-container [data-import-id].active {
        z-index: 2;
        position: relative;
    }
    /* fix for when framer layers are bigger than screen */
    .framerContext { overflow: hidden; }
    .framerLayer svg { pointer-events: none; }
    /* override framer empty svg width and height that may mess up actions layers */
    .framerLayer svg:not([width]) { width: auto; }
    .framerLayer svg:not([height]) { height: auto; }
"""
