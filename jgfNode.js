const check = require('check-types');
const { Guard } = require('./guard');

/**
 * A node object represents a node in a graph.
 */
class JGFNode {

    /**
     * Constructor
     * @param {string} id Primary key for the node, that is unique for the object type.
     * @param {string} label A text display for the node.
     * @param {object,null} metadata Metadata about the node.
     */
    constructor(id, label, metadata = null) {
        this.id = id;
        this.label = label;
        this.metadata = metadata;
    }

    set metadata(metadata) {
        if (check.assigned(metadata)) {
            Guard.assertValidMetadata(metadata);
        }
        this._metadata = metadata;
    }

    get metadata() {
        return this._metadata;
    }
}

module.exports = {
    JGFNode,
};