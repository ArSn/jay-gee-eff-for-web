const check = require('check-types');

/**
 * Various guards.
 */
class Guard {

    static assertNonEmptyStringParameter(name, value) {
        if (!check.nonEmptyString(value)) {
            throw new Error('Parameter "' + name + '" has to be an non-empty string.');
        }
    }

    static assertValidMetadata(metadata) {
        if (!check.nonEmptyObject(metadata)) {
            throw new Error('Metadata on an node has to be an object.');
        }
    }

    static assertValidDirected(directed) {
        if (!check.boolean(directed)) {
            throw new Error('Directed flag on an edge has to be boolean.');
        }
    }
}

module.exports = {
    Guard,
};