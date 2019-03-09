const { assert } = require('chai');
const { JgfMultiGraph, JgfGraph } = require('..');

describe('MultiGraph', () => {
    describe('#createMultiGraph', () => {
        it('should create empty multi graph', () => {
            let multiGraph = new JgfMultiGraph();
            assert.notEqual(null, multiGraph);

            assert.isNull(null, multiGraph.graphs);
        });
    });

    describe('#addGraph', () => {
        it('should add a graph to the container', () => {
            let multiGraph = new JgfMultiGraph();

            multiGraph.addGraph(new JgfGraph());
            assert.equal(multiGraph.graphs.length, 1);

            multiGraph.addGraph(new JgfGraph());
            assert.equal(multiGraph.graphs.length, 2);
        });
    });

    describe('#mutators', () => {
        it('should set and get metadata', () => {
            let multiGraph = new JgfMultiGraph();
            const metdata = { wegot: 'crass' };

            assert.isNull(multiGraph.metadata);

            multiGraph.metadata = metdata;
            assert.deepEqual(multiGraph.metadata, metdata);
        });
    });
});