const { assert } = require('chai');
const { JGFContainer } = require('../jgfContainer');
const { JGFGraph } = require('../jgfGraph');
const simple = require('simple-mock');

describe('Graph', () => {
    describe('#add graph node', () => {
        it('should add a simple node to a graph', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'lebron-james#2254';
            const nodeLabel = 'LeBron James';

            graph.addNode(nodeId, nodeLabel);
            assert.equal(1, graph.nodes.length);
            assert.equal(nodeId, graph.nodes[0].id);
            assert.equal(nodeLabel, graph.nodes[0].label);
        })

        it('should add a node to a graph, with meta data', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            const metadata = {
                type: 'NBAPlayer',
                position: 'Power Forward',
                shirt: 35
            };

            graph.addNode(nodeId, nodeLabel, metadata);
            assert.equal(1, graph.nodes.length);
            assert.equal('Power Forward', graph.nodes[0].metadata.position);
            assert.equal(35, graph.nodes[0].metadata.shirt);
        })


        it('should throw error when adding a node that already exists', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(nodeId, nodeLabel);

            assert.throw(() => graph.addNode(nodeId, nodeLabel), Error, 'A node already exists');
        })

        it('should throw error when adding nodes that already exist', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(nodeId, nodeLabel);

            const moreNodes = [
                {
                    id: 'kevin-durant#4497',
                    label: 'Kevin Durant'
                },
                {
                    id: 'kyrie-irving#9876',
                    label: 'Kyrie Irving'
                }
            ];

            assert.throw(() => graph.addNodes(moreNodes), Error, 'A node already exists');
        })

        it('should add multiple nodes at once', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const moreNodes = [
                {
                    id: 'kevin-durant#4497',
                    label: 'Kevin Durant'
                },
                {
                    id: 'kyrie-irving#9876',
                    label: 'Kyrie Irving'
                }
            ];

            graph.addNodes(moreNodes);

            assert.equal(graph.nodes[0].id, 'kevin-durant#4497');
            assert.equal(graph.nodes[0].label, 'Kevin Durant');
            assert.equal(graph.nodes[1].id, 'kyrie-irving#9876');
            assert.equal(graph.nodes[1].label, 'Kyrie Irving');
        })

    })

    describe('#updateNode', () => {
        it('should update label of node', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-love#0000';
            const nodeLabel = 'Kevin Lofe';

            graph.addNode(nodeId, nodeLabel);
            const correctLabel = 'Kevin Love';
            graph.updateNode(nodeId, correctLabel);
            assert.equal(correctLabel, graph.nodes[0].label);
        })

        it('should update metadata of node', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-love#0000';
            const nodeLabel = 'Meta Date';

            graph.addNode(nodeId, nodeLabel);
            const correctLabel = 'Meta Data';
            graph.updateNode(nodeId, null, correctLabel);
            assert.equal(correctLabel, graph.nodes[0].metadata);
        })

        it('throw error if node does not exist', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            assert.throws(() => graph.updateNode('nonsense-node'));
        })

    })

    describe('#removeNode', () => {
        it('should remove a node', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(nodeId, nodeLabel);

            graph.removeNode(nodeId);
            assert.equal(0, graph.nodes.length, 'After removeNode there should be zero nodes');
        })

        it('should throw error when removing a non existant node', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            assert.throws(() => graph.removeNode('some dummy id'), 'A node doesn\'t exist');
        })
    })

    describe('#getNode', () => {
        it('should lookup a node by id', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(nodeId, nodeLabel);

            let node = graph.getNode(nodeId);
            assert(node !== null);
            assert(node.id === nodeId);
        })

        it('should throw error when looking up a non existant node', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            assert.throws(() => graph.getNode('some dummy id'), 'A node doesn\'t exist');
        })
    })

    describe('#addEdge', () => {
        it('should add a simple edge to a graph', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);

            assert.equal(2, graph.nodes.length);

            graph.addEdge(node1Id, node2Id, playerContractRelation);

            assert.equal(1, graph.edges.length);
            assert.equal(playerContractRelation, graph.edges[0].relation);
        })

        it('should add optional parameters to the edge before adding it if they are passed', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);

            assert.equal(2, graph.nodes.length);

            graph.addEdge(node1Id, node2Id, 'Plays for', null, 'metaData');

            assert.equal(1, graph.edges.length);
            assert.equal('Plays for', graph.edges[0].relation);
            assert.equal(null, graph.edges[0].label);
            assert.equal(null, graph.edges[0].directed);

            graph.addEdge(node1Id, node2Id, null, 'awesomeLabel', null, true);

            assert.equal(2, graph.edges.length);
            assert.equal(null, graph.edges[1].relation);
            assert.equal('awesomeLabel', graph.edges[1].label);
            assert.equal(null, graph.edges[1].metadata);
            assert.equal(true, graph.edges[1].directed);
        })

        it('should throw error if source or target nodes do not exist and graph is not partial', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const node1Id = 'lebron-james#234';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#12345';
            const node2Label = 'Los Angeles Lakers';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);

            assert.throws(() => graph.addEdge(node1Id + '-nonsense', node2Id, 'Plays for', null, 'metaData'));
            assert.throws(() => graph.addEdge(node1Id, node2Id + '-nonsense', 'Plays for', null, 'metaData'));
            assert.throws(() => graph.addEdge(node1Id + '-nonsense', node2Id + '-nonsense', 'Plays for', null, 'metaData'));
        })

        it('should throw error if mandatory parameter is missing', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            assert.throws(() => graph.addEdge());
            assert.throws(() => graph.addEdge('sourceNodeId'));
            assert.throws(() => graph.addEdge(null, 'targetNodeId'));
        })
    })

    describe('#addEdges', () => {
        it('should not call addEdge if no edges are passed', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            let fn = simple.mock(graph, 'addEdge').callOriginal();

            graph.addEdges([]);

            assert.equal(fn.callCount, 0);
        })

        it('should call addEdge with parameters if edges are passed', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            let fn = simple.mock(graph, 'addEdge').callFn(function () {});

            graph.addEdges([
                {
                    source: 'firstSource',
                    target: 'targetOne',
                    relation: 'firstRelation',
                    label: 'labelOne',
                    metadata: 'someMetaData',
                    directed: true,
                },
                {
                    source: 'secondSource',
                    target: 'targetTwo',
                    relation: 'secondRelation',
                    label: 'labelTwo',
                    metadata: 'someMoreMetaData',
                    directed: false,
                }
            ]);

            assert.equal(fn.callCount, 2);

            assert.equal(fn.calls[0].args[0], 'firstSource');
            assert.equal(fn.calls[0].args[1], 'targetOne');
            assert.equal(fn.calls[0].args[2], 'firstRelation');
            assert.equal(fn.calls[0].args[3], 'labelOne');
            assert.equal(fn.calls[0].args[4], 'someMetaData');
            assert.equal(fn.calls[0].args[5], true);

            assert.equal(fn.calls[1].args[0], 'secondSource');
            assert.equal(fn.calls[1].args[1], 'targetTwo');
            assert.equal(fn.calls[1].args[2], 'secondRelation');
            assert.equal(fn.calls[1].args[3], 'labelTwo');
            assert.equal(fn.calls[1].args[4], 'someMoreMetaData');
            assert.equal(fn.calls[1].args[5], false);

        })

        it('should add partial graph edges', () => {
            let container = new JGFContainer();
            let graph = container.graph;
            graph.isPartial = true;

            const node1Id = 'lebron-james#2544';
            const node1Label = 'LeBron James';

            const partialNode2Id = 'la-lakers#1610616839';

            const playerContractRelation = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addEdge(node1Id, partialNode2Id, playerContractRelation);

            let edges = graph.edges;
            assert(edges !== null);
            assert.equal(1, edges.length);
        })
    })

    describe('#removeEdges', () => {
        it('should remove a graph edge', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);
            graph.addEdge(node1Id, node2Id, playerContractRelation);

            graph.removeEdges(node1Id, node2Id, playerContractRelation);
            assert.equal(0, graph.edges.length, 'After removeEdges there should be zero edges');
        })
    })

    describe('#getEdges', () => {
        it('should lookup edges', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);
            graph.addEdge(node1Id, node2Id, playerContractRelation);

            let edges = graph.getEdges(node1Id, node2Id, playerContractRelation);
            assert(edges !== null);
            assert.equal(1, edges.length);
        })

        it('should throw error if source or target node does not exist and graph is not partial', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);
            graph.addEdge(node1Id, node2Id, playerContractRelation);

            assert.throws(() => graph.getEdges('lebron-james#2254-nonsense', node2Id, playerContractRelation));
            assert.throws(() => graph.getEdges(node1Id, 'la-lakers#1610616839-nonsense', playerContractRelation));
        })

        xit('should return partial edges if graph is partial', () => {
            let container = new JGFContainer();
            let graph = container.graph;
            graph.isPartial = true;

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(node1Id, node1Label);
            graph.addNode(node2Id, node2Label);
            graph.addEdge(node1Id, node2Id, playerContractRelation);

            // todo: this does not yet return partial edges if there are any, functionality missing
            let edges = graph.getEdges('lebron-james#2254-nonsense', node2Id, playerContractRelation);
            assert(edges !== null);
            assert.equal(1, edges.length);
        })
    })

    describe('#loadFromJson', () => {
        it('should be able to set and get matadata', () => {
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
            assert.equal(graph.nodes[10].metadata, 'whaaat');

            assert.equal(graph.edges[0].source, 'firstNodeId');
            assert.equal(graph.edges[0].target, 'Node');
            assert.equal(graph.edges[0].relation, 'is-test-edge');
            assert.equal(graph.edges[0].label, 'edge-label');
            assert.equal(graph.edges[0].metadata, 'edge-metadata');
            assert.equal(graph.edges[0].directed, true);
        })
    })

    describe('#allMutators', () => {
        it('should be able to set and get matadata', () => {
            let graph = new JGFGraph();
            assert.isNull(graph.metadata, 'metadata not null by default');

            graph.metadata = 'some-setting-metadata';
            assert.equal(graph.metadata, 'some-setting-metadata')
        })

        it('should be able to set and get label', () => {
            let graph = new JGFGraph();
            assert.equal(graph.label, '', 'label not an empty string by default');

            graph.label = 'some-setting-label';
            assert.equal(graph.label, 'some-setting-label')
        })

        it('should be able to set and get type', () => {
            let graph = new JGFGraph();
            assert.equal(graph.type, '', 'type not an empty string by default');

            graph.type = 'some-setting-type';
            assert.equal(graph.type, 'some-setting-type')
        })
    })

    describe('#getJsonProperty', () => {
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
            let graph = new JGFGraph('someType', 'someLabel', true, []);
            graph.isPartial = true;

            assert.deepEqual(graph.json, {
                type: 'someType',
                label: 'someLabel',
                directed: true,
                nodes: [],
                edges: [],
            });

            assert.doesNotHaveAnyKeys(graph.json, 'metadata');
        })
    })

    describe('#graphDimensions', () => {
        it('should return zero dimensions for an empty graph', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            let dimensions = graph.graphDimensions;
            assert.equal(0, dimensions.nodes);
            assert.equal(0, dimensions.edges);
        })


        it('should return valid dimensions for a non-empty graph', () => {
            let container = new JGFContainer();
            let graph = container.graph;

            graph.addNode('node1', 'nodeTypeA');
            graph.addNode('node2', 'nodeTypeB');
            graph.addEdge('node1', 'node2', 'edgeTypeC');

            let dimensions = graph.graphDimensions;
            assert.equal(2, dimensions.nodes);
            assert.equal(1, dimensions.edges);
        })
    })

});