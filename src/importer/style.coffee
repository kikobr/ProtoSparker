module.exports = """
    #svgContainer {
        visibility: hidden;
        display: block;
        position: relative;
        z-index: 999;
    }
    #svgContainer [data-import-id] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    #svgContainer [data-import-id].active {
        z-index: 2;
        position: relative;
    }
"""
