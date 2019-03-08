const { JgfGraph } = require('./jgfGraph');

/**
 * Jgf Container (main class) of zero or more Jgf graphs
 */
class JgfContainer {

    /**
     * Constructor
     * @param {*} singleGraph true for single-graph mode, false for multi-graph mode
     */
    constructor(singleGraph = true) {
        this._graphs = [];
        this.isSingleGraph = singleGraph;

        if (singleGraph) {
            this.addEmptyGraph();
        }
    }

    /**
     * Returns all graphs, in Multi-Graph mode
     */
    get graphs() {
        if (this.isSingleGraph) {
            throw new Error('Cannot call graphs() in Single-Graph mode')
        }

        return this._graphs;
    }

    /**
     * Returns the graph, in Single-Graph mode
     */
    get graph() {
        if (!this.isSingleGraph) {
            throw new Error('Cannot call graph() in Multi-Graph mode')
        }

        return this._graphs[0];
    }

    /**
     * Returns true if the container is in Multi-Graph mode
     */
    get isMultiGraph() {
        return !this.isSingleGraph;
    }

    /**
     * Adds an empty graph
     */
    addEmptyGraph() {
        let graph = new JgfGraph();
        this._graphs.push(graph);

        return graph;
    }
}

module.exports = {
    JgfContainer,
};