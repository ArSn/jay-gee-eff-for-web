const check = require('check-types');
const _ = require('lodash');
const { JgfEdge } = require('./jgfEdge');
const { Guard } = require('./guard');

/**
 * An graph object represents the full graph and contains all nodes and edges that the graph consists of.
 */
class JgfGraph {

    /**
     * Constructor
     * @param {string} type Graph classification.
     * @param {string} label A text display for the graph.
     * @param {boolean} directed Pass true for a directed graph, false for an undirected graph.
     * @param {object|null} metadata Custom graph metadata.
     */
    constructor(type = '', label = '', directed = true, metadata = null) {
        this._nodes = [];
        this._edges = [];

        this.type = type;
        this.label = label;
        this.directed = directed;
        this._metadata = metadata;
    }

    /**
     * @param {string} nodeId Node to be found.
     * @private
     */
    _findNodeById(nodeId) {
        let foundNode = _.find(this._nodes, (existingNode) => existingNode.id === nodeId);
        if (!foundNode) {
            throw new Error(`A node does not exist with id = ${nodeId}`);
        }

        return foundNode;
    }

    /**
     * @param {JgfNode} node Node to be found.
     * @private
     */
    _nodeExists(node) {
        return this._nodeExistsById(node.id);
    }

    /**
     * @param {string} nodeId Node to be found.
     * @private
     */
    _nodeExistsById(nodeId) {
        let foundNode = _.find(this._nodes, (existingNode) => existingNode.id === nodeId);

        return Boolean(foundNode);
    }

    /**
     * Sets the graph meta data.
     */
    set metadata(value) {
        Guard.assertValidMetadataOrNull(value);
        this._metadata = value;
    }

    /**
     * Returns the graph meta data.
     */
    get metadata() {
        return this._metadata;
    }

    /**
     * Returns all nodes.
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * Returns all edges.
     */
    get edges() {
        return this._edges;
    }

    /**
     * Adds a node to the graph.
     * @param {JgfNode} node Node to be added.
     * @throws Error if the node already exists.
     */
    addNode(node) {
        if (this._nodeExists(node)) {
            throw new Error(`A node already exists with id = ${node.id}`);
        }

        this._nodes.push(node);
    }


    /**
     * Adds multiple nodes to the graph.
     * @param {JgfNode[]} nodes A collection of Jgf node objects to be added.
     * @throws Error if one of nodes already exists.
     */
    addNodes(nodes) {
        for (let node of nodes) {
            this.addNode(node);
        }
    }

    /**
     * Removes an existing node from the graph.
     * @param {JgfNode} node Node to be removed.
     */
    removeNode(node) {
        if (!this._nodeExists(node)) {
            throw new Error(`A node does not exist with id = ${node.id}`);
        }

        _.remove(this._nodes, (existingNode) => existingNode.id === node.id);
    }

    /**
     * Get a node by a node ID.
     * @param {string} nodeId Unique node ID.
     */
    getNodeById(nodeId) {
        return this._findNodeById(nodeId);
    }

    /**
     * Adds an edge to the graph.
     * @param {JgfEdge} edge The edge to be added.
     */
    addEdge(edge) {
        this._guardAgainstNonExistentNodes(edge.source, edge.target);
        this._edges.push(edge);
    }

    _guardAgainstNonExistentNodes(source, target) {
        if (!this._nodeExistsById(source)) {
            throw new Error(`addEdge failed: source node isn't found in nodes. source = ${source}`);
        }

        if (!this._nodeExistsById(target)) {
            throw new Error(`addEdge failed: target node isn't found in nodes. target = ${target}`);
        }
    }

    /**
     * Adds multiple edges to the graph.
     * @param {JgfEdge[]} edges A collection of Jgf edge objects to be added.
     */
    addEdges(edges) {
        for (let edge of edges) {
            this.addEdge(edge);
        }
    }

    /**
     * Removes existing edge from the graph.
     * @param {JgfEdge} edge Edge to be removed.
     */
    removeEdge(edge) {
        _.remove(this._edges, (existingEdge) => existingEdge.isEqualTo(edge, true));
    }

    /**
     * Get edges between source node and target node, with an optional edge relation.
     * @param {string} source Source node ID.
     * @param {string} target Target node ID.
     * @param {string|null} relation If passed, only edges having this relation will be returned.
     */
    getEdgesByNodes(source, target, relation = null) {
        this._guardAgainstNonExistentNodes(source, target);

        let edge = new JgfEdge(source, target, relation);

        return _.filter(this._edges, (existingEdge) => existingEdge.isEqualTo(edge, check.assigned(relation)));
    }

    get graphDimensions() {
        return {
            nodes: this._nodes.length,
            edges: this._edges.length,
        };
    }
}

module.exports = {
    JgfGraph,
};