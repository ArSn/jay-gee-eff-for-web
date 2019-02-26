const fastClone = require('fast-clone');

const cloneObject = (obj) => {
    return fastClone(obj);
};

module.exports = {
    cloneObject,
};