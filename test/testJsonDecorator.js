const { assert } = require('chai');
const { JgfNode, JgfEdge, JgfGraph, JgfMultiGraph, JgfJsonDecorator } = require('..');

describe('JsonDecorator', () => {
    describe('#to json', () => {
        it('should throw error for non supported objects', () => {
            assert.throws(() => JgfJsonDecorator.toJson(new JgfNode()));
            assert.throws(() => JgfJsonDecorator.toJson(new JgfEdge()));
            assert.throws(() => JgfJsonDecorator.toJson(new JgfJsonDecorator()));
            assert.throws(() => JgfJsonDecorator.toJson(new Object.create()));
            assert.throws(() => JgfJsonDecorator.toJson(null));
            assert.throws(() => JgfJsonDecorator.toJson(2));
            assert.throws(() => JgfJsonDecorator.toJson('hello'));

            assert.doesNotThrow(() => JgfJsonDecorator.toJson(new JgfGraph()));
            assert.doesNotThrow(() => JgfJsonDecorator.toJson(new JgfMultiGraph()));
        });

        it('should transform single graph to json', () => {
            let graph = new JgfGraph('someType', 'someLabel', true, { bla: 'some-meta-data' });

            graph.addNode(new JgfNode('firstNodeId', 'blubb-label', { bla: 'whoopp' }));
            graph.addNode(new JgfNode('secondNodeId', 'bla-label', { bli: 'whaaat' }));

            graph.addEdge(new JgfEdge('firstNodeId', 'secondNodeId', 'is-test-edge', 'edge-label', { meta: 'edge-metadata' }, true));

            assert.deepEqual(JgfJsonDecorator.toJson(graph), [{
                type: 'someType',
                label: 'someLabel',
                directed: true,
                metadata: { bla: 'some-meta-data' },
                nodes:
                    [
                        {id: 'firstNodeId', label: 'blubb-label', metadata: { bla: 'whoopp' }},
                        {id: 'secondNodeId', label: 'bla-label', metadata: { bli: 'whaaat' }},
                    ],
                edges:
                    [{
                        source: 'firstNodeId',
                        target: 'secondNodeId',
                        relation: 'is-test-edge',
                        label: 'edge-label',
                        metadata: { meta: 'edge-metadata' },
                        directed: true,
                    }]
            }]);
        });

        xit('should transform multigraph to json', () => {

        });
    });
});