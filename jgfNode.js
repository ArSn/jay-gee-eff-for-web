const check = require('check-types');

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
        this._id = id;
        this._label = label;
        this.metadata = metadata;
    }

    static _guardAgainstInvalidMetaData(metadata) {
        if (!check.nonEmptyObject(metadata)) {
            throw Error('Metadata on an node has to be an object.');
        }
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set label(label) {
        this._label = label;
    }

    get label() {
        return this._label;
    }

    set metadata(metadata) {
        if (check.assigned(metadata)) {
            JGFNode._guardAgainstInvalidMetaData(metadata);
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