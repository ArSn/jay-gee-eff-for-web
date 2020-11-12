const { assert } = require('chai');
const Ajv = require('ajv');
const fs = require('fs');

const schemaPath = __dirname + '/../../jgfSchemaV1.json';

const invalidExamples = [
  'bad_car_graphs.json',
];

const validExamples = [
  'car_graphs.json',
];

describe('v1 Test Examples', () => {
  describe('All files', () => {
    it('should be valid according to the schema', () => {

      let schema;
      fs.readFile( schemaPath, function (err, data) {
        if (err) {
          throw err;
        }
        schema = JSON.parse(data);

        var ajv = new Ajv();


        // ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        const validator = ajv.compile(schema);


        fs.readFile( __dirname + '/v1/car_graphs.json', function (err, data) {
          if (err) {
            throw err;
          }
          // console.log(data.toString());

          assert.isTrue(validator(JSON.parse(data)));
        });
      });
    });

    // it('should allow omitting optional parameters', () => {
    //   let edge = new JgfEdge('earth', 'moon');
    //
    //   assert.equal(edge.source, 'earth');
    //   assert.equal(edge.target, 'moon');
    //   assert.isNull(edge.relation);
    //   assert.isNull(edge.label);
    //   assert.isNull(edge.metadata);
    //   assert.isTrue(edge.directed);
    // });
  });

});
