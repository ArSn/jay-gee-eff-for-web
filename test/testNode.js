const { assert } = require('chai');
const { JGFNode } = require('../jgfNode');

describe('Node', () => {
    describe('#constructor', () => {
        it('should set passed parameters to properties', () => {
            let node = new JGFNode('first-knot', 'First Knot', { foo: 'bar' });

            assert.equal(node._id, 'first-knot');
            assert.equal(node._label, 'First Knot');
            assert.deepEqual(node._metadata, { foo: 'bar' });
        });

        it('should only set objects passed as metadata to metadata property', () => {
            let node;

            ['string-metadata', 2, ['bla'], {}].forEach((invalidMetaData) => {
                assert.throws(() => new JGFNode('id', 'label', invalidMetaData));
            });
        });
    })

    describe('#mutators', () => {
        it('should set and get id', () => {
            let node = new JGFNode('id', 'label');
            node.id = 'other-id';
            assert.equal('other-id', node.id);
        });

        it('should set and get label', () => {
            let node = new JGFNode('id', 'label');
            node.label = 'other-label';
            assert.equal('other-label', node.label);
        });

        it('should set and get metadata', () => {
            let node = new JGFNode('id', 'label');
            node.metadata = { some: 'thing' };
            assert.deepEqual({ some: 'thing' }, node.metadata);
        });

        it('should only set objects passed as metadata to metadata property', () => {
            let node = new JGFNode('id', 'label');

            ['string-metadata', 2, ['bla'], {}].forEach((invalidMetaData) => {
                assert.throws(() => node.metadata = invalidMetaData);
            });
        });
    })
});