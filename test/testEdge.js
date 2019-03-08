const { assert } = require('chai');
const { JgfEdge } = require('..');

describe('Edge', () => {
    describe('#constructor', () => {
        it('should set passed parameters to properties', () => {
            let edge = new JgfEdge('earth', 'moon', 'has-satellite', 'Earth Moon', { distance: 'about 1 light second' }, false);

            assert.equal(edge.source, 'earth');
            assert.equal(edge.target, 'moon');
            assert.equal(edge.relation, 'has-satellite');
            assert.equal(edge.label, 'Earth Moon');
            assert.deepEqual(edge.metadata, { distance: 'about 1 light second' });
            assert.equal(edge.directed, false);
        });

        it('should allow omitting optional parameters', () => {
            let edge = new JgfEdge('earth', 'moon');

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
            let edge = new JgfEdge('earth', 'moon');

            assert.throws(() => edge.source = null);
            assert.throws(() => edge.source = 2);
            assert.throws(() => edge.source = []);

            assert.throws(() => edge.target = null);
            assert.throws(() => edge.target = 2);
            assert.throws(() => edge.target = []);
        });

        it('should set and get valid source', () => {
            let edge = new JgfEdge('earth', 'moon');

            edge.source = 'orbit';
            assert.equal(edge.source, 'orbit');
        });

        it('should set and get valid target', () => {
            let edge = new JgfEdge('earth', 'moon');

            edge.target = 'orbit';
            assert.equal(edge.target, 'orbit');
        });

        it('should throw error on setting invalid metadata', () => {
            let edge = new JgfEdge('earth', 'moon');

            assert.throws(() => edge.metadata = 2);
            assert.throws(() => edge.metadata = []);
            assert.throws(() => edge.metadata = {});
        });

        it('should set and get valid metadata', () => {
            let edge = new JgfEdge('earth', 'moon');

            edge.metadata = { bla: 'bli' };
            assert.deepEqual(edge.metadata, { bla: 'bli' });

            edge.metadata = null;
            assert.isNull(edge.metadata);
        });

        it('should throw error on setting invalid directed', () => {
            let edge = new JgfEdge('earth', 'moon');

            assert.throws(() => edge.directed = 2);
            assert.throws(() => edge.directed = []);
            assert.throws(() => edge.directed = {});
            assert.throws(() => edge.directed = null);
        });

        it('should set and get valid directed', () => {
            let edge = new JgfEdge('earth', 'moon');

            edge.directed = true;
            assert.isTrue(edge.directed);

            edge.directed = false;
            assert.isFalse(edge.directed);
        });
    });

    describe('#is equal to', () => {
        it('should know equal edges are equal', () => {
            let edge = new JgfEdge('earth', 'moon');
            let equalEdge = new JgfEdge('earth', 'moon');

            assert.isTrue(edge.isEqualTo(equalEdge, true));

            edge = new JgfEdge('earth', 'moon', 'is-satellite');
            equalEdge = new JgfEdge('earth', 'moon', 'is-satellite');

            assert.isTrue(edge.isEqualTo(equalEdge));
            assert.isTrue(edge.isEqualTo(equalEdge, true));

            edge = new JgfEdge('earth', 'moon', 'is-satellite');
            equalEdge = new JgfEdge('earth', 'moon', 'attracts');

            assert.isTrue(edge.isEqualTo(equalEdge));
            assert.isTrue(edge.isEqualTo(equalEdge, false));

            edge = new JgfEdge('earth', 'moon', 'is-satellite', 'does-not');
            equalEdge = new JgfEdge('earth', 'moon', 'is-satellite', 'influence-equal');

            assert.isTrue(edge.isEqualTo(equalEdge));
            assert.isTrue(edge.isEqualTo(equalEdge, true));

            edge = new JgfEdge('earth', 'moon', 'is-satellite', 'does-not');
            equalEdge = new JgfEdge('earth', 'moon', 'attracts', 'influence-equal');

            assert.isTrue(edge.isEqualTo(equalEdge));
            assert.isTrue(edge.isEqualTo(equalEdge, false));
        });

        it('should know different edges are not equal', () => {
            let edge = new JgfEdge('earth', 'moon');
            let differentEdge = new JgfEdge('earth', 'sun');

            assert.isFalse(edge.isEqualTo(differentEdge));
            assert.isFalse(edge.isEqualTo(differentEdge, true));

            edge = new JgfEdge('earth', 'moon', 'is-satellite');
            differentEdge = new JgfEdge('earth', 'moon', 'attracts');

            assert.isFalse(edge.isEqualTo(differentEdge, true));

            edge = new JgfEdge('earth', 'moon', 'same-relation', 'extra-params-dont-matter');
            differentEdge = new JgfEdge('earth', 'sun', 'same-relation', 'extra-params-dont-matter');

            assert.isFalse(edge.isEqualTo(differentEdge, true));

            edge = new JgfEdge('earth', 'moon', 'is-satellite', 'extra-params-dont-matter');
            differentEdge = new JgfEdge('earth', 'moon', 'attracts', 'extra-params-dont-matter');

            assert.isFalse(edge.isEqualTo(differentEdge, true));
        });
    });
});