const { assert } = require('chai');
const { JGFContainer } = require('../jgfContainer');
const { JGFGraph } = require('../jgfGraph');
const { JGFNode } = require('../jgfNode');
const { JGFEdge } = require('../jgfEdge');
const simple = require('simple-mock');

describe('Graph', () => {
    describe('#add node(s)', () => {
        it('should add a simple node', () => {
            let graph = new JGFGraph();

            const nodeId = 'lebron-james#2254';
            const nodeLabel = 'LeBron James';

            graph.addNode(new JGFNode(nodeId, nodeLabel));
            assert.equal(1, graph.nodes.length);
            assert.equal(nodeId, graph.nodes[0].id);
            assert.equal(nodeLabel, graph.nodes[0].label);
        });

        it('should add a node to a graph, with meta data', () => {
            let graph = new JGFGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            const metadata = {
                type: 'NBAPlayer',
                position: 'Power Forward',
                shirt: 35
            };

            graph.addNode(new JGFNode(nodeId, nodeLabel, metadata));
            assert.equal(1, graph.nodes.length);
            assert.equal('Power Forward', graph.nodes[0].metadata.position);
            assert.equal(35, graph.nodes[0].metadata.shirt);
        });


        it('should throw error when adding a node that already exists', () => {
            let graph = new JGFGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JGFNode(nodeId, nodeLabel));

            assert.throw(() => graph.addNode(new JGFNode(nodeId, nodeLabel)), Error, 'A node already exists');
        });

        it('should throw error when adding nodes that already exist', () => {
            let graph = new JGFGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JGFNode(nodeId, nodeLabel));

            const moreNodes = [
                new JGFNode(nodeId, nodeLabel),
                new JGFNode('kyrie-irving#9876', 'Kyrie Irving'),
            ];

            assert.throw(() => graph.addNodes(moreNodes), Error, 'A node already exists');
        });

        it('should add multiple nodes at once', () => {
            let graph = new JGFGraph();

            const moreNodes = [
                new JGFNode('kevin-durant#4497', 'Kevin Durant'),
                new JGFNode('kyrie-irving#9876', 'Kyrie Irving'),
            ];

            graph.addNodes(moreNodes);

            assert.equal(graph.nodes[0].id, 'kevin-durant#4497');
            assert.equal(graph.nodes[0].label, 'Kevin Durant');
            assert.equal(graph.nodes[1].id, 'kyrie-irving#9876');
            assert.equal(graph.nodes[1].label, 'Kyrie Irving');
        });

    });

    describe('#removeNode', () => {
        it('should remove a node', () => {
            let graph = new JGFGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JGFNode(nodeId, nodeLabel));

            graph.removeNode(new JGFNode(nodeId, nodeLabel));
            assert.equal(0, graph.nodes.length, 'After removeNode there should be zero nodes');
        });

        it('should throw error when removing a non existant node', () => {
            let graph = new JGFGraph();

            assert.throws(() => graph.removeNode('some dummy id'), 'A node does not exist');
        });
    });

    describe('#getNodeById', () => {
        it('should lookup a node by id', () => {
            let graph = new JGFGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JGFNode(nodeId, nodeLabel));

            let node = graph.getNodeById(nodeId);
            assert(node !== null);
            assert(node.id === nodeId);
        });

        it('should throw error when looking up a non existant node', () => {
            let graph = new JGFGraph();

            assert.throws(() => graph.getNodeById('some dummy id'), 'A node does not exist');
        });
    });

    describe('#addEdge', () => {
        it('should add a simple edge to a graph', () => {
            let graph = new JGFGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JGFNode(node1Id, node1Label));
            graph.addNode(new JGFNode(node2Id, node2Label));

            assert.equal(2, graph.nodes.length);

            graph.addEdge(new JGFEdge(node1Id, node2Id, playerContractRelation));

            assert.equal(1, graph.edges.length);
            assert.equal(playerContractRelation, graph.edges[0].relation);
        });

        it('should throw error if source or target nodes do not exist', () => {
            let graph = new JGFGraph();

            const node1Id = 'lebron-james#234';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#12345';
            const node2Label = 'Los Angeles Lakers';

            graph.addNode(new JGFNode(node1Id, node1Label));
            graph.addNode(new JGFNode(node2Id, node2Label));

            assert.throws(() => graph.addEdge(new JGFEdge(node1Id + '-nonsense', node2Id, 'Plays for', null, 'metaData')));
            assert.throws(() => graph.addEdge(new JGFEdge(node1Id, node2Id + '-nonsense', 'Plays for', null, 'metaData')));
            assert.throws(() => graph.addEdge(new JGFEdge(node1Id + '-nonsense', node2Id + '-nonsense', 'Plays for', null, 'metaData')));
        });

        it('should throw error if mandatory parameter is missing', () => {
            let graph = new JGFGraph();

            assert.throws(() => graph.addEdge());
            assert.throws(() => graph.addEdge('sourceNodeId'));
            assert.throws(() => graph.addEdge(null, 'targetNodeId'));
        });
    });

    describe('#addEdges', () => {
        it('should not call addEdge if no edges are passed', () => {
            let graph = new JGFGraph();

            let fn = simple.mock(graph, 'addEdge').callOriginal();

            graph.addEdges([]);

            assert.equal(fn.callCount, 0);
        });

        it('should call addEdge for each edge', () => {
            let graph = new JGFGraph();

            let fn = simple.mock(graph, 'addEdge').callFn(function () {});

            const edgeOne = new JGFEdge('firstSource', 'targetOne', 'targetOne', 'labelOne', { some: 'stuff' }, true);
            const edgeTwo = new JGFEdge('secondSource', 'targetTwo', 'secondRelation', 'labelTwo', { other: 'things' }, false);

            graph.addEdges([
                edgeOne,
                edgeTwo,
            ]);

            assert.equal(fn.callCount, 2);

            assert.deepEqual(fn.calls[0].args[0], edgeOne);
            assert.deepEqual(fn.calls[1].args[0], edgeTwo);
        });
    });

    describe('#removeEdge', () => {
        it('should remove a graph edge', () => {
            let graph = new JGFGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JGFNode(node1Id, node1Label));
            graph.addNode(new JGFNode(node2Id, node2Label));
            graph.addEdge(new JGFEdge(node1Id, node2Id, playerContractRelation));

            graph.removeEdge(new JGFEdge(node1Id, node2Id, playerContractRelation));
            assert.equal(0, graph.edges.length, 'After removeEdges there should be zero edges');
        });

        it('should only remove the edge specified by relation parameter', () => {
            let graph = new JGFGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';
            const salaryRelation = 'Gets his salary paid by';

            graph.addNode(new JGFNode(node1Id, node1Label));
            graph.addNode(new JGFNode(node2Id, node2Label));
            graph.addEdge(new JGFEdge(node1Id, node2Id, playerContractRelation));
            graph.addEdge(new JGFEdge(node1Id, node2Id, salaryRelation));
            assert.equal(graph.edges.length, 2);

            graph.removeEdge(new JGFEdge(node1Id, node2Id, playerContractRelation));
            assert.equal(graph.edges.length, 1, 'One edge should remain after removing one specific relation');
            assert.equal(salaryRelation, graph.edges[0].relation, 'Salary relation should still exist');

            graph.removeEdge(new JGFEdge(node1Id, node2Id));
            assert.equal(graph.edges.length, 1, 'After removeEdges without relation parameter second edge should still be there due to omitting relation');

            graph.removeEdge(new JGFEdge(node1Id, node2Id, salaryRelation));
            assert.equal(graph.edges.length, 0, 'After removeEdges with relation parameter there should be zero edges');
        });
    });

    describe('#getEdgesByNodes', () => {
        it('should lookup edges', () => {
            let graph = new JGFGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JGFNode(node1Id, node1Label));
            graph.addNode(new JGFNode(node2Id, node2Label));

            const expectedEdge = new JGFEdge(node1Id, node2Id, playerContractRelation)
            graph.addEdge(expectedEdge);

            let edges = graph.getEdgesByNodes(node1Id, node2Id, playerContractRelation);
            assert.equal(edges.length, 1);
            assert.deepEqual(edges[0], expectedEdge);
        });

        it('should throw error if source or target node does not exist and graph is not partial', () => {
            let graph = new JGFGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JGFNode(node1Id, node1Label));
            graph.addNode(new JGFNode(node2Id, node2Label));
            graph.addEdge(new JGFEdge(node1Id, node2Id, playerContractRelation));

            assert.throws(() => graph.getEdgesByNodes('lebron-james#2254-nonsense', node2Id, playerContractRelation));
            assert.throws(() => graph.getEdgesByNodes(node1Id, 'la-lakers#1610616839-nonsense', playerContractRelation));
            assert.throws(() => graph.getEdgesByNodes('blubb', 'bla'));
        });
    });

    xdescribe('#loadFromJson', () => {
        it('should load graph from json', () => {
            let graph = new JGFGraph();
            graph.loadFromJSON({
                type: 'someType',
                label: 'someLabel',
                directed: true,
                metadata: {bla: 'some-meta-data', isPartial: true},
                nodes:
                    [
                        {id: 'firstNodeId', label: 'blubb-label', metadata: 'whoopp'},
                        {id: 'secondNodeId', label: 'bla-label', metadata: 'whaaat'},
                    ],
                edges:
                    [{
                        source: 'firstNodeId',
                        target: 'secondNodeId',
                        relation: 'is-test-edge',
                        label: 'edge-label',
                        metadata: 'edge-metadata',
                        directed: true,
                    }]
            });

            assert.equal(graph.type, 'someType');
            assert.equal(graph.label, 'someLabel');
            // todo: there is no mutator for graph.directed or something alike, and I wonder what this property is for,
            //  since each edge has a config on its on whether it is directed or not, I can only imagine that this is
            //  supposed to be used as a default "directed" setting when adding new edges, but this does not happen yet
            //  --> therefore: clarify by spec and implement accordingly!
            assert.deepEqual(graph.metadata, {bla: 'some-meta-data', isPartial: true});

            assert.equal(graph.nodes[0].id, 'firstNodeId');
            assert.equal(graph.nodes[0].label, 'blubb-label');
            assert.equal(graph.nodes[0].metadata, 'whoopp');
            assert.equal(graph.nodes[1].id, 'secondNodeId');
            assert.equal(graph.nodes[1].label, 'bla-label');
            assert.equal(graph.nodes[1].metadata, 'whaaat');

            assert.equal(graph.edges[0].source, 'firstNodeId');
            assert.equal(graph.edges[0].target, 'secondNodeId');
            assert.equal(graph.edges[0].relation, 'is-test-edge');
            assert.equal(graph.edges[0].label, 'edge-label');
            assert.equal(graph.edges[0].metadata, 'edge-metadata');
            assert.equal(graph.edges[0].directed, true);
        })

        // todo: this test does not really seem reasonable, see related todo in JGFGraph.loadFromJSON
        it('should always consider graphs that are loaded from json directed graphs', () => {
            let graph = new JGFGraph();
            graph.loadFromJSON({
                directed: true,
                nodes: [],
                edges: [],
            });

            assert.isTrue(graph._directed);

            graph = new JGFGraph();
            graph.loadFromJSON({
                directed: false,
                nodes: [],
                edges: [],
            });

            assert.isTrue(graph._directed);

            graph = new JGFGraph();
            graph.loadFromJSON({
                nodes: [],
                edges: [],
            });

            assert.isTrue(graph._directed);
        })
    })

    describe('#mutators', () => {
        it('should be able to set and get matadata', () => {
            let graph = new JGFGraph();
            assert.isNull(graph.metadata, 'metadata not null by default');

            const metadata = { bla: 'some-setting-metadata' };

            graph.metadata = metadata;
            assert.equal(graph.metadata, metadata);
        });
    });

    xdescribe('#getJsonProperty', () => {
        it('should create json representation of current state', () => {
            // todo: does not yet support metadata which is not a json object because it ALWAYS adds a "isPartial" property
            //  to to the metadata upon json creation, add functionallty and then cover it with tests!
            //  (IMHO) this should go to the grpah itself and not to the metadata
            let graph = new JGFGraph('someType', 'someLabel', true, {bla:'some-meta-data'});
            graph.isPartial = true;

            graph.addNode('firstNodeId', 'blubb-label', 'whoopp');
            graph.addNode('secondNodeId', 'bla-label', 'whaaat');

            graph.addEdge('firstNodeId', 'secondNodeId', 'is-test-edge', 'edge-label', 'edge-metadata', true);

            assert.deepEqual(graph.json, {
                type: 'someType',
                label: 'someLabel',
                directed: true,
                metadata: {bla: 'some-meta-data', isPartial: true},
                nodes:
                    [
                        {id: 'firstNodeId', label: 'blubb-label', metadata: 'whoopp'},
                        {id: 'secondNodeId', label: 'bla-label', metadata: 'whaaat'},
                    ],
                edges:
                    [{
                        source: 'firstNodeId',
                        target: 'secondNodeId',
                        relation: 'is-test-edge',
                        label: 'edge-label',
                        metadata: 'edge-metadata',
                        directed: true,
                    }]
            });
        })

        it('should not add metadata to json representation if metadata is empty', () => {
            let graph = new JGFGraph('someType', 'someLabel', true);

            assert.deepEqual(graph.json, {
                type: 'someType',
                label: 'someLabel',
                directed: true,
                nodes: [],
                edges: [],
            });

            assert.doesNotHaveAnyKeys(graph.json, 'metadata');
        })

        // todo: verify that this is actually a valid test according to spec and it makes sense to handle it this way
        //  - otherwise, remove this functionality
        it('should not mark metadata partial if graph is not marked partial', () => {

            let graph = new JGFGraph('someType', 'someLabel', true, { bla: 'blubb' });

            assert.doesNotHaveAnyKeys(graph.json.metadata, 'isPartial');
        })
    })

    describe('#graphDimensions', () => {
        it('should return zero dimensions for an empty graph', () => {
            let graph = new JGFGraph();

            let dimensions = graph.graphDimensions;
            assert.equal(0, dimensions.nodes);
            assert.equal(0, dimensions.edges);
        });


        it('should return valid dimensions for a non-empty graph', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            graph.addNode(new JGFNode('node1', 'nodeTypeA'));
            graph.addNode(new JGFNode('node2', 'nodeTypeB'));
            graph.addEdge(new JGFEdge('node1', 'node2', 'edgeTypeC'));

            let dimensions = graph.graphDimensions;
            assert.equal(2, dimensions.nodes);
            assert.equal(1, dimensions.edges);
        });
    });

});