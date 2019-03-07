const { assert } = require('chai');
const { JGFEdge } = require('../jgfEdge');

describe('Edge', () => {
    describe('#constructor', () => {
        it('should set passed parameters to properties', () => {
            let edge = new JGFEdge('earth', 'moon', 'has-satellite', 'Earth Moon', { distance: 'about 1 light second' }, false);

            assert.equal(edge.source, 'earth');
            assert.equal(edge.target, 'moon');
            assert.equal(edge.relation, 'has-satellite');
            assert.equal(edge.label, 'Earth Moon');
            assert.deepEqual(edge.metadata, { distance: 'about 1 light second' });
            assert.equal(edge.directed, false);
        });

        it('should allow omitting optional parameters', () => {
            let edge = new JGFEdge('earth', 'moon');

            assert.equal(edge.source, 'earth');
            assert.equal(edge.target, 'moon');
            assert.isNull(edge.relation);
            assert.isNull(edge.label);
            assert.isNull(edge.metadata);
            assert.isTrue(edge.directed);
        });
    });

    describe('#mutators', () => {
        it('should throw error on setting invalid source id or target id', () => {
            let edge = new JGFEdge('earth', 'moon');

            assert.throws(() => edge.source = null);
            assert.throws(() => edge.source = 2);
            assert.throws(() => edge.source = []);

            assert.throws(() => edge.target = null);
            assert.throws(() => edge.target = 2);
            assert.throws(() => edge.target = []);
        });

        it('should set and get valid source', () => {
            let edge = new JGFEdge('earth', 'moon');

            edge.source = 'orbit';
            assert.equal(edge.source, 'orbit');
        });

        it('should set and get valid target', () => {
            let edge = new JGFEdge('earth', 'moon');

            edge.target = 'orbit';
            assert.equal(edge.target, 'orbit');
        });

        it('should throw error on setting invalid metadata', () => {
            let edge = new JGFEdge('earth', 'moon');

            assert.throws(() => edge.metadata = 2);
            assert.throws(() => edge.metadata = []);
            assert.throws(() => edge.metadata = {});
        });

        it('should set and get valid metadata', () => {
            let edge = new JGFEdge('earth', 'moon');

            edge.metadata = { bla: 'bli' };
            assert.deepEqual(edge.metadata, { bla: 'bli' });

            edge.metadata = null;
            assert.isNull(edge.metadata);
        });

        it('should throw error on setting invalid directed', () => {
            let edge = new JGFEdge('earth', 'moon');

            assert.throws(() => edge.directed = 2);
            assert.throws(() => edge.directed = []);
            assert.throws(() => edge.directed = {});
            assert.throws(() => edge.directed = null);
        });

        it('should set and get valid directed', () => {
            let edge = new JGFEdge('earth', 'moon');

            edge.directed = true;
            assert.isTrue(edge.directed);

            edge.directed = false;
            assert.isFalse(edge.directed);
        });
    })
});