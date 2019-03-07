const { assert } = require('chai');
const { Guard } = require('../guard');

describe('Guard', () => {
    describe('#non empty string parameter', () => {
        it('should throw error on anything else than a non-empty string', () => {
            assert.throws(() => Guard.assertNonEmptyStringParameter('bla', 12));
            assert.throws(() => Guard.assertNonEmptyStringParameter('bla', null));
            assert.throws(() => Guard.assertNonEmptyStringParameter('bla', {}));
            assert.throws(() => Guard.assertNonEmptyStringParameter('bla', ''));
        });

        it('should not throw error on an non-empty string', () => {
            assert.doesNotThrow(() => Guard.assertNonEmptyStringParameter('bla', 'hello'));
            assert.doesNotThrow(() => Guard.assertNonEmptyStringParameter('bla', 'ok'));
        });
    });

    describe('#valid metadata', () => {
        it('should throw error on invalid metadata', () => {
            assert.throws(() => Guard.assertValidMetadata('bla'));
            assert.throws(() => Guard.assertValidMetadata(null));
            assert.throws(() => Guard.assertValidMetadata([]));
            assert.throws(() => Guard.assertValidMetadata({}));
        });

        it('should not throw error valid metadata', () => {
            assert.doesNotThrow(() => Guard.assertValidMetadata({ some: 'data' }));
            assert.doesNotThrow(() => Guard.assertValidMetadata({ some: 'data', more: 'stuff' }));
        });
    });

    describe('#valid directed', () => {
        it('should throw error on invalid directed', () => {
            assert.throws(() => Guard.assertValidDirected('bla'));
            assert.throws(() => Guard.assertValidDirected(null));
            assert.throws(() => Guard.assertValidDirected(2));
            assert.throws(() => Guard.assertValidDirected([]));
        });

        it('should not throw error valid metadata', () => {
            assert.doesNotThrow(() => Guard.assertValidDirected(true));
            assert.doesNotThrow(() => Guard.assertValidDirected(false));
        });
    });
});