const { Guard } = require('./guard');

/**
 * An edge object represents a edge between two nodes in a graph.
 */
class JgfEdge {

    /**
     * Constructor
     * @param {string} source Source node id
     * @param {string} target Target node id
     * @param {string|null} relation Edge relation (AKA 'relationship type')
     * @param {string|null} label Edge label (the display name of the edge)
     * @param {object|null} metadata Custom edge meta data
     * @param {boolean|null} directed true for a directed edge, false for undirected
     */
    constructor(source, target, relation = null, label = null, metadata = null, directed = true) {
        this.source = source;
        this.target = target;
        this.relation = relation;
        this.label = label;
        this.metadata = metadata;
        this.directed = directed;
    }

    set source(source) {
        Guard.assertNonEmptyStringParameter('source', source);
        this._source = source;
    }

    get source() {
        return this._source;
    }

    set target(target) {
        Guard.assertNonEmptyStringParameter('target', target);
        this._target = target;
    }

    get target() {
        return this._target;
    }

    set metadata(metadata) {
        Guard.assertValidMetadataOrNull(metadata);
        this._metadata = metadata;
    }

    get metadata() {
        return this._metadata;
    }

    set directed(directed) {
        Guard.assertValidDirected(directed);
        this._directed = directed;
    }

    get directed() {
        return this._directed;
    }

    /**
     * Determines whether this edge is equal to the passed edge.
     * @param {JgfEdge} edge The edge to compare to.
     * @param {boolean} compareRelation Whether or not to compare the relation as well.
     */
    isEqualTo(edge, compareRelation = false) {
        return edge.source === this.source
            && edge.target === this.target
            && (compareRelation === false || edge.relation === this.relation);
    }
}

module.exports = {
    JgfEdge,
};