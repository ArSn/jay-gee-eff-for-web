const { Guard } = require('./guard');

/**
 * Jgf multiple graphs.
 */
class JgfMultiGraph {

    /**
     * Constructor
     */
    constructor(type, label, metadata = null) {
        this.type = type;
        this.label = label;
        this._metadata = metadata;

        this._graphs = [];
    }

    /**
     * Add a single graph.
     * @param {JgfGraph} graph
     */
    addGraph(graph) {
        this._graphs.push(graph);
    }

    get graphs() {
        return this._graphs;
    }

    set metadata(metadata) {
        Guard.assertValidMetadata(metadata);
        this._metadata = metadata;
    }

    get metadata() {
        return this._metadata;
    }
}

module.exports = {
    JgfMultiGraph,
};