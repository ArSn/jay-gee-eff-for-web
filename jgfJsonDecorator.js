const _ = require('lodash');
const deepdash = require('deepdash/deepdash');
deepdash(_);
const check = require('check-types');
const { JgfNode } = require('./jgfNode');
const { JgfEdge } = require('./jgfEdge');
const { JgfGraph } = require('./jgfGraph');
const { JgfMultiGraph } = require('./jgfMultiGraph');

/**
 * Transforms graphs or multi graphs to json or vice versa.
 *
 * Note that this is just called decorator for semantic reasons and does not follow and does not intend to follow
 * the GoF decorator design pattern.
 */
class JgfJsonDecorator {

    /**
     * Creates a Jgf graph or multi graph from JSON.
     * @param {object} json JSON to be transformed to a graph or multigraph. This has to be according to the JGF.
     * @throws Error if json can not be transformed to a graph or multi graph.
     * @returns {JgfGraph|JgfMultiGraph} The created Jgf graph or multi graph object.
     */
    static fromJson(json) {
        if (check.assigned(json.graph)) {
            return this._graphFromJson(json.graph);
        }

        if (check.assigned(json.graphs)) {
            let graph = new JgfMultiGraph(json.type, json.label, json.metadata);
            _.each(json.graphs, (graphJson) => {
                graph.addGraph(this._graphFromJson(graphJson))
            });

            return graph;
        }

        throw new Error('Passed json has to to have a "graph" or "graphs" property.');
    }

    /**
     * Creates a single JGF graph from JSON.
     * @param {object} graphJson
     * @returns {JgfGraph}
     * @private
     */
    static _graphFromJson(graphJson) {
        let graph = new JgfGraph(graphJson.type, graphJson.label, graphJson.directed, graphJson.metadata);

        _.each(graphJson.nodes, (node) => {
            graph.addNode(new JgfNode(node.id, node.label, node.metadata));
        });

        _.each(graphJson.edges, (edge) => {
            graph.addEdge(new JgfEdge(edge.source, edge.target, edge.relation, edge.label, edge.metadata, edge.directed));
        });

        return graph;
    }

    static _guardAgainstInvalidGraphObject(graph) {
        if (!check.instance(graph, JgfGraph) && !check.instance(graph, JgfMultiGraph)) {
            throw new Error('JgfJsonDecorator can only decorate graphs or multi graphs.');
        }
    }

    /**
     * Transforms either a graph or a multi graph object to a JSON representation as per the spec.
     * @param {JgfGraph|JgfMultiGraph} graph The graph to be transformed to JSON.
     * @throws Error if the passed graph or multi graph can not be transformed to JSON.
     * @returns {object} A JSON representation of the passed graph or multi graph as according to the JGF.
     */
    static toJson(graph) {
        this._guardAgainstInvalidGraphObject(graph);

        const isSingleGraph = check.instance(graph, JgfGraph);

        let allGraphsJson = {
            graphs: [],
        };

        this._transformGraphsToJson(graph, allGraphsJson);

        if (isSingleGraph) {
            return this._removeNullValues({ graph: allGraphsJson.graphs[0] });
        }

        allGraphsJson.type = graph.type;
        allGraphsJson.label = graph.label;
        allGraphsJson.metadata = graph.metadata;

        return this._removeNullValues(allGraphsJson);
    }

    static _transformGraphsToJson(graph, allGraphsJson) {
        let normalizedGraph = this._normalizeToMultiGraph(graph);
        _.each(normalizedGraph.graphs, (singleGraph) => {

            let singleGraphJson = {
                type: singleGraph.type,
                label: singleGraph.label,
                directed: singleGraph.directed,
                metadata: singleGraph.metadata,
                nodes: [],
                edges: [],
            };

            this._nodesToJson(singleGraph, singleGraphJson);
            this._edgesToJson(singleGraph, singleGraphJson);

            allGraphsJson.graphs.push(singleGraphJson);
        });
    }

    static _removeNullValues(json) {
        return _.filterDeep(json, (value) => value !== null);
    }

    /**
     * @param {JgfGraph} graph
     * @param {object} json
     * @private
     */
    static _edgesToJson(graph, json) {
        _.each(graph.edges, (edge) => {
            json.edges.push({
                source: edge.source,
                target: edge.target,
                relation: edge.relation,
                label: edge.label,
                metadata: edge.metadata,
                directed: edge.directed,
            });
        });
    }

    /**
     * @param {JgfGraph} graph
     * @param {object} json
     * @private
     */
    static _nodesToJson(graph, json) {
        _.each(graph.nodes, (node) => {
            json.nodes.push({
                id: node.id,
                label: node.label,
                metadata: node.metadata,
            });
        });
    }

    static _normalizeToMultiGraph(graph) {
        let normalizedGraph = graph;
        if (check.instance(graph, JgfGraph)) {
            normalizedGraph = new JgfMultiGraph();
            normalizedGraph.addGraph(graph);
        }

        return normalizedGraph;
    }
}

module.exports = {
    JgfJsonDecorator,
};