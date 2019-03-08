const check = require('check-types');
const _ = require('lodash');
const { cloneObject } = require('./common');
const { JGFNode } = require('./jgfNode');

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
        let foundNode = _.find(this._nodes, (existingNode) => { return existingNode.id === nodeId } );
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
        let foundNode = _.find(this._nodes, (existingNode) => { return existingNode.id === nodeId } );
        return !!foundNode;
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
        return cloneObject(this._edges);
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
            edges: this._getJsonEdges(),
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

    _getJsonEdges() {
        let edges = [];
        if (check.assigned(this._edges) && this._edges.length > 0) {
            edges = this._edges;
        }

        return edges;
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

        _.remove(this._nodes, (existingNode) => { return existingNode.id === node.id });
    }

    /**
     * Get a node by a node id.
     * @param {string} nodeId Unique node id
     */
    getNodeById(nodeId) {
        return this._findNodeById(nodeId);
    }

    /**
     * Adds an edge between a source node and a target node
     * @param {*} source Source node id
     * @param {*} target Target node id
     * @param {*} relation Edge relation (AKA 'relationship type')
     * @param {*} label Edge label (the display name of the edge)
     * @param {*} metadata Custom edge meta data
     * @param {*} directed true for a directed edge, false for undirected
     */
    addEdge(source, target, relation = null, label = null, metadata = null, directed = null) {
        JGFGraph._guardAgainstEmptyNodeParams(source, target);

        let edge = {
            source,
            target,
        };
        if (check.assigned(relation)) {
            edge.relation = relation;
        }
        if (check.assigned(label)) {
            edge.label = label;
        }
        if (check.assigned(metadata)) {
            edge.metadata = metadata;
        }
        if (check.assigned(directed)) {
            edge.directed = directed;
        }

        this._edges.push(edge);
    }

    _guardAgainstNonExistentNodes(source, target) {
        if (!(source in this._nodes)) {
            throw new Error(`addEdge failed: source node isn't found in nodes. source = ${source}`);
        }

        if (!(target in this._nodes)) {
            throw new Error(`addEdge failed: target node isn't found in nodes. target = ${target}`);
        }
    }

    static _guardAgainstEmptyNodeParams(source, target) {
        if (!source) {
            throw new Error('addEdge failed: source parameter is not valid');
        }

        if (!target) {
            throw new Error('addEdge failed: target parameter is not valid');
        }
    }

    /**
     * Adds multiple edges
     * @param {*} edges A collection of JGF edge obejcts
     */
    addEdges(edges) {
        if (edges) {
            for (let edge of edges) {
                this.addEdge(edge.source, edge.target, edge.relation, edge.label, edge.metadata, edge.directed);
            }
        }
    }

    /**
     * Checks whether the passed edge is equal to an edge with all other three passed params.
     * @param {*} edge
     * @param {*} source Source node id
     * @param {*} target Target node id
     * @param {*} relation Specific edge relation type to remove. If empty then all edges will be removed, regardless of their relation
     */
    static _isEdgeEqual(edge, source, target, relation) {
        return edge.source === source &&
            edge.target === target &&
            (relation === '' || edge.relation === relation);
    }

    /**
     * Removes existing graph edges
     * @param {*} source Source node id
     * @param {*} target Target node id
     * @param {*} relation Specific edge relation type to remove. If empty then all edges will be removed, regardless of their relation
     */
    removeEdges(source, target, relation = '') {
        _.remove(this._edges, (edge) => JGFGraph._isEdgeEqual(edge, source, target, relation));
    }

    /**
     * Get edges between source node and target node, with an optional edge relation
     * @param {*} source
     * @param {*} target
     * @param {*} relation
     */
    getEdges(source, target, relation = '') {
        let edges = _.filter(this._edges, (edge) => JGFGraph._isEdgeEqual(edge, source, target, relation));

        return cloneObject(edges);
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