const { assert } = require('chai');
const { JGFContainer } = require('../jgfContainer');

/* eslint no-invalid-this: 0 */

describe('PartialGraph', () => {
    describe('#partial graph edges', () => {
        it('should add partial graph edges', () => {
            let container = new JGFContainer(singleGraph = true);
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
});