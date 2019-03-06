const { assert } = require('chai');
const { JGFEdge } = require('../jgfEdge');

describe('Edge', () => {
    describe('#constructor', () => {
        it('should set passed parameters to properties', () => {
            let edge = new JGFEdge('earth', 'moon', 'has-satellite', 'Earth Moon', { distance: 'about 1 light second' }, false);

            assert.equal(edge._source, 'earth');
            assert.equal(edge._target, 'moon');
            assert.equal(edge._label, 'Earth Moon');
            assert.deepEqual(edge._metadata, { distance: 'about 1 light second' });
            assert.equal(edge._directed, false);
        });

        xit('should only set objects passed as metadata to metadata property', () => {
        });
    });

    describe('#mutators', () => {
        xit('should set and get something', () => {

        });


    })
});