const { Guard } = require('./guard');

/**
 * A node object represents a node in a graph. In graph theory, nodes are also called points or vertices.
 */
class JgfNode {

    /**
     * Constructor
     * @param {string} id Primary key for the node, that is unique for the object type.
     * @param {string} label A text display for the node.
     * @param {object|null} metadata Metadata about the node.
     */
    constructor(id, label, metadata = null) {
        this.id = id;
        this.label = label;
        this.metadata = metadata;
    }

    set metadata(metadata) {
        Guard.assertValidMetadataOrNull(metadata);
        this._metadata = metadata;
    }

    get metadata() {
        return this._metadata;
    }
}

module.exports = {
    JgfNode,
};