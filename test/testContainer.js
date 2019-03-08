const { assert } = require('chai');
const { JgfContainer } = require('../jgfContainer');

xdescribe('Container', () => {
    describe('#createContainerSingleGraph', () => {
        it('should create a valid empty graph container, in Single-Graph mode', () => {
            let container = new JgfContainer();
            assert.notEqual(null, container);

            let graph = container.graph;
            assert.notEqual(null, graph);
            assert.notEqual(null, graph.nodes);
        })
    })

    describe('#throwErrorGettingGraphsInSingleGraphMode', () => {
        it('should throw an error when trying to access "graphs" even though there is only one', () => {
            let container = new JgfContainer();

            assert.throws(() => { container.graphs }, Error, 'Cannot call graphs() in Single-Graph mode');
        })
    })

    describe('#createContainerMultiGraph', () => {
        it('should create a valid empty graph container, in Multi-Graph mode', () => {
            let container = new JgfContainer(singleGraph = false);
            assert.notEqual(null, container);

            let graphs = container.graphs;
            assert.notEqual(null, graphs);
            assert.equal(0, graphs.length);
        })
    })

    describe('#throwErrorGettingGraphInMultiGraphMode', () => {
        it('should throw an error when trying to access "graph" even though there are more than one', () => {
            let container = new JgfContainer(singleGraph = false);

            assert.throws(() => { container.graph }, Error, 'Cannot call graph() in Multi-Graph mode');
        })
    })

    describe('#addEmptyGraph', () => {
        it('should add a graph to the container, in Multi-Graph mode', () => {
            let container = new JgfContainer(singleGraph = false);

            let graph = container.addEmptyGraph();
            assert.equal(1, container.graphs.length);
            assert.notEqual(null, graph);
            assert.notEqual(null, graph.nodes);
        })
    })

    describe('#knowsWhetherItIsInSingleOrMultiGraphMode', () => {
        it('should not be multi graph by default', () => {
            let container = new JgfContainer();

            assert.isFalse(container.isMultiGraph);
        })

        it('should not be multi graph if single graph passed as true', () => {
            let container = new JgfContainer();

            assert.isFalse(container.isMultiGraph);
        })

        it('should be multi graph if single graph passed as false', () => {
            let container = new JgfContainer(singleGraph = false);

            assert.isTrue(container.isMultiGraph);
        })
    })
});