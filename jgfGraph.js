const check = require('check-types');
const _ = require('lodash');
const { cloneObject } = require('./common');
const { JGFEdge } = require('./jgfEdge');

/**
 * A single JGF graph instance, always contained in a parent JGFContainer
 */
class JGFGraph {

    /**
     * Constructor
     * @param {*} type graph classification
     * @param {*} label a text display for the graph
     * @param {*} directed true for a directed graph, false for an undirected graph
     * @param {*} metadata about the graph
     */
    constructor(type = '', label = '', directed = true, metadata = null) {
        this._nodes = [];
        this._edges = [];

        this._type = type;
        this._label = label;
        this._directed = directed;
        this._metadata = metadata;
    }


    /**
     * Loads the graph from a JGF JSON object
     * @param {*} graphJson JGF JSON object
     */
    loadFromJSON(graphJson) {
        this._type = graphJson.type;
        this._label = graphJson.label;
        // todo: this makes the graph always directed (even if false is passed), I doubt that this was the intention here
        this._directed = graphJson.directed || true;
        this._metadata = graphJson.metadata;

        this._nodes = [];
        this._edges = [];
        this.addNodes(graphJson.nodes);
        this.addEdges(graphJson.edges);
    }

    /**
     * @param {JGFNode} node Node to be found.
     * @private
     */
    _findNode(node) {
        return this._findNodeById(node.id);
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
     * @param {JGFNode} node Node to be found.
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
     * Returns the graph type
     */
    get type() {
        return this._type;
    }

    /**
     * Set the graph type
     */
    set type(value) {
        this._type = value;
    }

    /**
     * Returns the graph label
     */
    get label() {
        return this._label;
    }

    /**
     * Set the graph label
     */
    set label(value) {
        this._label = value;
    }

    /**
     * Returns the graph meta data
     */
    get metadata() {
        return this._metadata;
    }

    /**
     * Set the graph meta data
     */
    set metadata(value) {
        this._metadata = value;
    }

    /**
     * Returns all nodes
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * Returns all edges
     */
    get edges() {
        return this._edges;
    }


    /**
     * Returns the graph as JGF Json
     */
    get json() {
        let json = {
            type: this._type,
            label: this._label,
            directed: this._directed,
            nodes: this._nodes,
            edges: this.edges,
        };

        let metadata = this._getJsonMetadata();
        if (metadata) {
            json.metadata = metadata;
        }

        return cloneObject(json);
    }

    _getJsonMetadata() {
        let metadata = null;
        if (check.assigned(this._metadata)) {
            metadata = this._metadata;
        }

        return metadata;
    }

    /**
     * Adds a new node
     * @param {JGFNode} node Node to be added.
     */
    addNode(node) {
        if (this._nodeExists(node)) {
            throw new Error(`A node already exists with id = ${node.id}`);
        }

        this._nodes.push(node);
    }


    /**
     * Adds multiple nodes
     * @param {JGFNode[]} nodes A collection of JGF node objects.
     */
    addNodes(nodes) {
        for (let node of nodes) {
            this.addNode(node);
        }
    }

    /**
     * Removes an existing graph node
     * @param {JGFNode} node Node to be removed.
     */
    removeNode(node) {
        if (!this._nodeExists(node)) {
            throw new Error(`A node does not exist with id = ${node.id}`);
        }

        _.remove(this._nodes, (existingNode) => existingNode.id === node.id);
    }

    /**
     * Get a node by a node id.
     * @param {string} nodeId Unique node id
     */
    getNodeById(nodeId) {
        return this._findNodeById(nodeId);
    }

    /**
     * Adds an edge between a source node and a target node.
     * @param {JGFEdge} edge Source node id
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
     * Adds multiple edges
     * @param {JGFEdge[]} edges A collection of JGF edge objects.
     */
    addEdges(edges) {
        for (let edge of edges) {
            this.addEdge(edge);
        }
    }

    /**
     * Removes existing graph edge.
     * @param {JGFEdge} edge Edge to be removed.
     */
    removeEdge(edge) {
        _.remove(this._edges, (existingEdge) => existingEdge.isEqualTo(edge, true));
    }

    /**
     * Get edges between source node and target node, with an optional edge relation.
     * @param {string} source Source node ID.
     * @param {string} target Target node ID.
     * @param {string,null} relation
     */
    getEdgesByNodes(source, target, relation = null) {
        this._guardAgainstNonExistentNodes(source, target);

        let edge = new JGFEdge(source, target, relation);

        return _.filter(this._edges, (existingEdge) => existingEdge.isEqualTo(edge, check.assigned(relation)));
    }

    get graphDimensions() {
        let dimensions = {
            nodes: 0,
            edges: 0,
        };

        dimensions.nodes = Object.keys(this._nodes).length;
        dimensions.edges = this._edges.length;

        return dimensions;
    }
}

module.exports = {
    JGFGraph,
};