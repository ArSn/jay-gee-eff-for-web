const { assert } = require('chai');
const { JgfNode } = require('..');

describe('Node', () => {
    describe('#constructor', () => {
        it('should set passed parameters to properties', () => {
            let node = new JgfNode('first-knot', 'First Knot', { foo: 'bar' });

            assert.equal(node.id, 'first-knot');
            assert.equal(node.label, 'First Knot');
            assert.deepEqual(node.metadata, { foo: 'bar' });
        });

        it('should only set objects passed as metadata to metadata property', () => {
            let node;

            ['string-metadata', 2, ['bla'], {}].forEach((invalidMetaData) => {
                assert.throws(() => new JgfNode('id', 'label', invalidMetaData));
            });
        });
    })

    describe('#mutators', () => {
        it('should set and get metadata', () => {
            let node = new JgfNode('id', 'label');
            node.metadata = { some: 'thing' };
            assert.deepEqual({ some: 'thing' }, node.metadata);
        });

        it('should only set objects passed as metadata to metadata property', () => {
            let node = new JgfNode('id', 'label');

            ['string-metadata', 2, ['bla'], {}].forEach((invalidMetaData) => {
                assert.throws(() => node.metadata = invalidMetaData);
            });
        });
    })
});