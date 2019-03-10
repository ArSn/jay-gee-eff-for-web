const { JgfNode, JgfEdge, JgfGraph, JgfJsonDecorator } = require('../index');

(() => {
    console.log('Building the NBA Jgf Graph...');
    let graph = new JgfGraph('sports', 'NBA Demo Graph');

    const node1Id = 'lebron-james#2544';
    const node1Label = 'LeBron James';
    const metadata1 = {
        type: 'NBA Player',
    };

    const node2Id = 'la-lakers#1610616839';
    const node2Label = 'Los Angeles Lakers';
    const metadata2 = {
        type: 'NBA Team',
    };

    const playerContractRelation = 'Plays for';

    console.log('Adding two nodes...');
    graph.addNode(new JgfNode(node1Id, node1Label, metadata1));
    graph.addNode(new JgfNode(node2Id, node2Label, metadata2));

    console.log('Adding an edge...');
    graph.addEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));

    console.log('Graph nodes:');
    for (let node of graph.nodes) {
        console.log(`\t${node.label} {${node.metadata.type}}`);
    }

    console.log('Graph edges:');
    for (let edge of graph.edges) {
        console.log(`\t${edge.source} (->${edge.relation}->) ${edge.target}`);
    }

    console.log('Full JSON representation:');
    console.log(JSON.stringify(JgfJsonDecorator.toJson(graph)));

    console.log('-- DONE --');
})();