const check = require('check-types');

/**
 * An edge object represents a edge between two nodes in a graph.
 */
class JGFEdge {

    /**
     * Constructor
     * @param {string} source Source node id
     * @param {string} target Target node id
     * @param {string,null} relation Edge relation (AKA 'relationship type')
     * @param {string,null} label Edge label (the display name of the edge)
     * @param {object,null} metadata Custom edge meta data
     * @param {boolean,null} directed true for a directed edge, false for undirected
     */
    constructor(source, target, relation = null, label = null, metadata = null, directed = true) {
        this.constructor._guardAgainstEmptyStringParameter('source', source);
        this.constructor._guardAgainstEmptyStringParameter('target', target);

        this._source = source;
        this._target = target;
        this._relation = relation;
        this._label = label;
        this.metadata = metadata;
        this.directed = directed;
    }

    // todo: all three of these guards could probably go into some global guarding class
    static _guardAgainstEmptyStringParameter(name, value) {
        if (!check.nonEmptyString(value)) {
            throw new Error('Parameter "' + name + '" has to be an non-empty string.');
        }
    }

    static _guardAgainstInvalidMetaData(metadata) {
        if (!check.nonEmptyObject(metadata)) {
            throw new Error('Metadata on an node has to be an object.');
        }
    }

    static _guardAgainstInvalidDirected(directed) {
        if (!check.boolean(directed)) {
            throw new Error('Directed flag on an edge has to be boolean.');
        }
    }

    set source(source) {
        this._source = source;
    }

    get source() {
        return this._source;
    }

    set target(target) {
        this._target = target;
    }

    get target() {
        return this._target;
    }

    set relation(relation) {
        this._relation = relation;
    }

    get relation() {
        return this._relation;
    }

    set label(label) {
        this._label = label;
    }

    get label() {
        return this._label;
    }

    set metadata(metadata) {
        if (check.assigned(metadata)) {
            this.constructor._guardAgainstInvalidMetaData(metadata);
        }
        this._metadata = metadata;
    }

    get metadata() {
        return this._metadata;
    }

    set directed(directed) {
        if (check.assigned(directed)) {
            this.constructor._guardAgainstInvalidDirected(directed);
        }
        this._directed = directed;
    }

    get directed() {
        return this._directed;
    }
}

module.exports = {
    JGFEdge,
};