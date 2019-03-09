const _ = require('lodash');
const check = require('check-types');
const { JgfGraph } = require('./jgfGraph');
const { JgfMultiGraph } = require('./jgfMultiGraph');

/**
 * Transforms graphs or multigraphs to json or vice versa.
 *
 * Note that this is just called decorator for semantic reasons and does not follow the GoF decorator design pattern.
 */
class JgfJsonDecorator {

    // static fromJson(json) {
    //     // todo: return graph or multigraph depending on data
    // }

    static _guardAgainstInvalidGraphObject(graph) {
        if (!check.instance(graph, JgfGraph) && !check.instance(graph, JgfMultiGraph)) {
            throw new Error('JgfJsonDecorator can only decorate graphs or multigraphs.');
        }
    }

    static toJson(graph) {
        JgfJsonDecorator._guardAgainstInvalidGraphObject(graph);

        let normalizedGraph = JgfJsonDecorator._normalizeToMultiGraph(graph);
        let allGraphsJson = [];

        _.each(normalizedGraph.graphs, (singleGraph) => {

            let singleGraphJson = {
                type: singleGraph.type,
                label: singleGraph.label,
                directed: singleGraph.directed,
                metadata: singleGraph.metadata,
                nodes: [],
                edges: [],
            };

            _.each(singleGraph.nodes, (node) => {
                singleGraphJson.nodes.push({
                    id: node.id,
                    label: node.label,
                    metadata: node.metadata,
                });
            });

            _.each(singleGraph.edges, (edge) => {
                singleGraphJson.edges.push({
                    source: edge.source,
                    target: edge.target,
                    relation: edge.relation,
                    label: edge.label,
                    metadata: edge.metadata,
                    directed: edge.directed,
                });
            });

            allGraphsJson.push(singleGraphJson);
        });

        return allGraphsJson;
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