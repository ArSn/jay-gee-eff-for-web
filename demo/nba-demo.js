const { JGFContainer } = require('../index');

(() => {

    console.log('Building the NBA JGF Graph...');
    let container = new JGFContainer();
    let graph = container.graph;
    graph.type = 'sports';
    graph.label = 'NBA Demo Graph';

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
    graph.addNode(node1Id, node1Label, metadata1);
    graph.addNode(node2Id, node2Label, metadata2);

    console.log('Adding an edge...');
    graph.addEdge(node1Id, node2Id, playerContractRelation);

    console.log('Graph nodes:');
    for (let node of container.graph.nodes) {
        console.log(`\t${node.label} {${node.metadata.type}}`);
    }

    console.log('Graph edges:');
    for (let edge of container.graph.edges) {
        console.log(`\t${edge.source} (->${edge.relation}->) ${edge.target}`);
    }

    console.log('Full JSON representation:');
    console.log(JSON.stringify(graph.json));

    console.log('-- DONE --');
})();