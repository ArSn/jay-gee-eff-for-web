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

            assert.deepEqual(JgfJsonDecorator.toJson(graph), {
                graph: {
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
                            metadata: {meta: 'edge-metadata'},
                            directed: true,
                        }]
                }
            });
        });

        it('should transform multigraph to json', () => {
            let multigraph = new JgfMultiGraph('weird-multigraph', 'This is weird', { weirdness: 100 });


            let graph = new JgfGraph('someType', 'someLabel', true, { bla: 'some-meta-data' });

            graph.addNode(new JgfNode('firstNodeId', 'blubb-label', { bla: 'whoopp' }));
            graph.addNode(new JgfNode('secondNodeId', 'bla-label', { bli: 'whaaat' }));

            graph.addEdge(new JgfEdge('firstNodeId', 'secondNodeId', 'is-test-edge', 'edge-label', { meta: 'edge-metadata' }, true));

            multigraph.addGraph(graph);


            graph = new JgfGraph('otherType', 'otherLabel', false, { ble: 'some-blumeta-data' });

            graph.addNode(new JgfNode('other-firstNodeId', 'effe-label', { ufe: 'schnad' }));
            graph.addNode(new JgfNode('other-secondNodeId', 'uffe-label', { bame: 'bral' }));

            graph.addEdge(new JgfEdge('other-firstNodeId', 'other-secondNodeId', 'is-ither-test-edge', 'other-edge-label', { other_meta: 'otheredge-metadata' }, false));

            multigraph.addGraph(graph);

            assert.deepEqual(JgfJsonDecorator.toJson(multigraph), {
                graphs: [
                    {
                        type: "someType",
                        label: "someLabel",
                        directed: true,
                        metadata: { bla: "some-meta-data" },
                        nodes: [
                            {id: "firstNodeId", label: "blubb-label", metadata: { bla: "whoopp" }},
                            {id: "secondNodeId", label: "bla-label", metadata: { bli: "whaaat" }},
                        ],
                        edges: [{
                            source: "firstNodeId",
                            target: "secondNodeId",
                            relation: "is-test-edge",
                            label: "edge-label",
                            metadata: { meta: "edge-metadata" },
                            directed: true,
                        }],
                    },
                    {
                        type: "otherType",
                        label: "otherLabel",
                        directed: false,
                        metadata: { ble: "some-blumeta-data"},
                        nodes: [
                            { id: "other-firstNodeId", label: "effe-label", metadata: { ufe: "schnad" } },
                            { id: "other-secondNodeId", label: "uffe-label", metadata: { bame: "bral" } },
                        ],
                        edges: [{
                            source: "other-firstNodeId",
                            target: "other-secondNodeId",
                            relation: "is-ither-test-edge",
                            label: "other-edge-label",
                            metadata: { other_meta: "otheredge-metadata" },
                            directed: false,
                        }],
                    }
                ]
            });
        });
    });
});