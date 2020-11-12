const { assert } = require('chai');
const Ajv = require('ajv');
const fs = require('fs');

const schemaPath = __dirname + '/../../jgfSchemaV1.json';

// todo: add test for invalid example (and some more tests)
const invalidExamples = [
  'bad_car_graphs.json',
];

const validExamples = [
  'car_graphs.json',
  'les_miserables.json',
  'nba-players.json',
  'nba-teams.json',
  'test.network.json',
  'usual_suspects.json',
];

describe('v1 Test Examples', () => {
  describe('Files should be valid according to the schema', () => {

    const ajv = new Ajv();
    const validator = ajv.compile(require(schemaPath));

    validExamples.forEach((filename) => {
      it('file ' + filename, () => {
        const example = require(__dirname + '/v1/' + filename);
        assert.isTrue(validator(example));
      });
    });
  });

});
