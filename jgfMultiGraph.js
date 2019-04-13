const { Guard } = require('./guard');

/**
 * Container for multiple Jgf graph objects in one object.
 */
class JgfMultiGraph {

    /**
     * Constructor
     * @param {string} type Multi graph classification.
     * @param {string} label A text display for the multi graph.
     * @param {object|null} metadata Custom multi graph metadata.
     */
    constructor(type, label, metadata = null) {
        this.type = type;
        this.label = label;
        this._metadata = metadata;

        this._graphs = [];
    }

    /**
     * Adds a single graph.
     * @param {JgfGraph} graph Graph to be added.
     */
    addGraph(graph) {
        this._graphs.push(graph);
    }

    /**
     * Returns all graphs.
     */
    get graphs() {
        return this._graphs;
    }

    /**
     * Sets the multi graph meta data.
     */
    set metadata(metadata) {
        Guard.assertValidMetadata(metadata);
        this._metadata = metadata;
    }

    /**
     * Returns the multi graph meta data.
     */
    get metadata() {
        return this._metadata;
    }
}

module.exports = {
    JgfMultiGraph,
};