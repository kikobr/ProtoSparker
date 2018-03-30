module.exports = traverse = (node, parent, parentLayer) ->

    for child, i in node.children
        traverse child, node, createdLayer ? createdLayer : null
