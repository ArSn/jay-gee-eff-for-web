const { assert } = require('chai');
const { JgfGraph, JgfNode, JgfEdge } = require('..');
const simple = require('simple-mock');

describe('Graph', () => {
    describe('#add node(s)', () => {
        it('should add a simple node', () => {
            let graph = new JgfGraph();

            const nodeId = 'lebron-james#2254';
            const nodeLabel = 'LeBron James';

            graph.addNode(new JgfNode(nodeId, nodeLabel));
            assert.equal(1, graph.nodes.length);
            assert.equal(nodeId, graph.nodes[0].id);
            assert.equal(nodeLabel, graph.nodes[0].label);
        });

        it('should add a node to a graph, with meta data', () => {
            let graph = new JgfGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            const metadata = {
                type: 'NBAPlayer',
                position: 'Power Forward',
                shirt: 35
            };

            graph.addNode(new JgfNode(nodeId, nodeLabel, metadata));
            assert.equal(1, graph.nodes.length);
            assert.equal('Power Forward', graph.nodes[0].metadata.position);
            assert.equal(35, graph.nodes[0].metadata.shirt);
        });


        it('should throw error when adding a node that already exists', () => {
            let graph = new JgfGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JgfNode(nodeId, nodeLabel));

            assert.throw(() => graph.addNode(new JgfNode(nodeId, nodeLabel)), Error, 'A node already exists');
        });

        it('should throw error when adding nodes that already exist', () => {
            let graph = new JgfGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JgfNode(nodeId, nodeLabel));

            const moreNodes = [
                new JgfNode(nodeId, nodeLabel),
                new JgfNode('kyrie-irving#9876', 'Kyrie Irving'),
            ];

            assert.throw(() => graph.addNodes(moreNodes), Error, 'A node already exists');
        });

        it('should add multiple nodes at once', () => {
            let graph = new JgfGraph();

            const moreNodes = [
                new JgfNode('kevin-durant#4497', 'Kevin Durant'),
                new JgfNode('kyrie-irving#9876', 'Kyrie Irving'),
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
            let graph = new JgfGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JgfNode(nodeId, nodeLabel));

            graph.removeNode(new JgfNode(nodeId, nodeLabel));
            assert.equal(0, graph.nodes.length, 'After removeNode there should be zero nodes');
        });

        it('should throw error when removing a non existant node', () => {
            let graph = new JgfGraph();

            assert.throws(() => graph.removeNode('some dummy id'), 'A node does not exist');
        });
    });

    describe('#getNodeById', () => {
        it('should lookup a node by id', () => {
            let graph = new JgfGraph();

            const nodeId = 'kevin-durant#4497';
            const nodeLabel = 'Kevin Durant';

            graph.addNode(new JgfNode(nodeId, nodeLabel));

            let node = graph.getNodeById(nodeId);
            assert(node !== null);
            assert(node.id === nodeId);
        });

        it('should throw error when looking up a non existant node', () => {
            let graph = new JgfGraph();

            assert.throws(() => graph.getNodeById('some dummy id'), 'A node does not exist');
        });
    });

    describe('#addEdge', () => {
        it('should add a simple edge to a graph', () => {
            let graph = new JgfGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JgfNode(node1Id, node1Label));
            graph.addNode(new JgfNode(node2Id, node2Label));

            assert.equal(2, graph.nodes.length);

            graph.addEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));

            assert.equal(1, graph.edges.length);
            assert.equal(playerContractRelation, graph.edges[0].relation);
        });

        it('should throw error if source or target nodes do not exist', () => {
            let graph = new JgfGraph();

            const node1Id = 'lebron-james#234';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#12345';
            const node2Label = 'Los Angeles Lakers';

            graph.addNode(new JgfNode(node1Id, node1Label));
            graph.addNode(new JgfNode(node2Id, node2Label));

            assert.throws(() => graph.addEdge(new JgfEdge(node1Id + '-nonsense', node2Id, 'Plays for', null, 'metaData')));
            assert.throws(() => graph.addEdge(new JgfEdge(node1Id, node2Id + '-nonsense', 'Plays for', null, 'metaData')));
            assert.throws(() => graph.addEdge(new JgfEdge(node1Id + '-nonsense', node2Id + '-nonsense', 'Plays for', null, 'metaData')));
        });

        it('should throw error if mandatory parameter is missing', () => {
            let graph = new JgfGraph();

            assert.throws(() => graph.addEdge());
            assert.throws(() => graph.addEdge('sourceNodeId'));
            assert.throws(() => graph.addEdge(null, 'targetNodeId'));
        });
    });

    describe('#addEdges', () => {
        it('should not call addEdge if no edges are passed', () => {
            let graph = new JgfGraph();

            let fn = simple.mock(graph, 'addEdge').callOriginal();

            graph.addEdges([]);

            assert.equal(fn.callCount, 0);
        });

        it('should call addEdge for each edge', () => {
            let graph = new JgfGraph();

            let fn = simple.mock(graph, 'addEdge').callFn(function () {});

            const edgeOne = new JgfEdge('firstSource', 'targetOne', 'targetOne', 'labelOne', { some: 'stuff' }, true);
            const edgeTwo = new JgfEdge('secondSource', 'targetTwo', 'secondRelation', 'labelTwo', { other: 'things' }, false);

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
            let graph = new JgfGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JgfNode(node1Id, node1Label));
            graph.addNode(new JgfNode(node2Id, node2Label));
            graph.addEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));

            graph.removeEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));
            assert.equal(0, graph.edges.length, 'After removeEdges there should be zero edges');
        });

        it('should only remove the edge specified by relation parameter', () => {
            let graph = new JgfGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';
            const salaryRelation = 'Gets his salary paid by';

            graph.addNode(new JgfNode(node1Id, node1Label));
            graph.addNode(new JgfNode(node2Id, node2Label));
            graph.addEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));
            graph.addEdge(new JgfEdge(node1Id, node2Id, salaryRelation));
            assert.equal(graph.edges.length, 2);

            graph.removeEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));
            assert.equal(graph.edges.length, 1, 'One edge should remain after removing one specific relation');
            assert.equal(salaryRelation, graph.edges[0].relation, 'Salary relation should still exist');

            graph.removeEdge(new JgfEdge(node1Id, node2Id));
            assert.equal(graph.edges.length, 1, 'After removeEdges without relation parameter second edge should still be there due to omitting relation');

            graph.removeEdge(new JgfEdge(node1Id, node2Id, salaryRelation));
            assert.equal(graph.edges.length, 0, 'After removeEdges with relation parameter there should be zero edges');
        });
    });

    describe('#getEdgesByNodes', () => {
        it('should lookup edges', () => {
            let graph = new JgfGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JgfNode(node1Id, node1Label));
            graph.addNode(new JgfNode(node2Id, node2Label));

            const expectedEdge = new JgfEdge(node1Id, node2Id, playerContractRelation);
            graph.addEdge(expectedEdge);

            let edges = graph.getEdgesByNodes(node1Id, node2Id, playerContractRelation);
            assert.equal(edges.length, 1);
            assert.deepEqual(edges[0], expectedEdge);
        });

        it('should throw error if source or target node does not exist and graph is not partial', () => {
            let graph = new JgfGraph();

            const node1Id = 'lebron-james#2254';
            const node1Label = 'LeBron James';

            const node2Id = 'la-lakers#1610616839';
            const node2Label = 'Los Angeles Lakers';

            const playerContractRelation = 'Plays for';

            graph.addNode(new JgfNode(node1Id, node1Label));
            graph.addNode(new JgfNode(node2Id, node2Label));
            graph.addEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));

            assert.throws(() => graph.getEdgesByNodes('lebron-james#2254-nonsense', node2Id, playerContractRelation));
            assert.throws(() => graph.getEdgesByNodes(node1Id, 'la-lakers#1610616839-nonsense', playerContractRelation));
            assert.throws(() => graph.getEdgesByNodes('blubb', 'bla'));
        });
    });

    describe('#mutators', () => {
        it('should be able to set and get matadata', () => {
            let graph = new JgfGraph();
            assert.isNull(graph.metadata, 'metadata not null by default');

            const metadata = { bla: 'some-setting-metadata' };

            graph.metadata = metadata;
            assert.equal(graph.metadata, metadata);
        });
    });

    describe('#graphDimensions', () => {
        it('should return zero dimensions for an empty graph', () => {
            let graph = new JgfGraph();

            let dimensions = graph.graphDimensions;
            assert.equal(0, dimensions.nodes);
            assert.equal(0, dimensions.edges);
        });


        it('should return valid dimensions for a non-empty graph', () => {
            let graph = new JgfGraph();

            graph.addNode(new JgfNode('node1', 'nodeTypeA'));
            graph.addNode(new JgfNode('node2', 'nodeTypeB'));
            graph.addEdge(new JgfEdge('node1', 'node2', 'edgeTypeC'));

            let dimensions = graph.graphDimensions;
            assert.equal(2, dimensions.nodes);
            assert.equal(1, dimensions.edges);
        });
    });

});