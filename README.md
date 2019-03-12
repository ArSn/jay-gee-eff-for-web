[![Gitlab pipeline status](https://img.shields.io/gitlab/pipeline/ArSn23/jay-gee-eff-for-web.svg?label=tests)](https://gitlab.com/ArSn23/jay-gee-eff-for-web/pipelines)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/ArSn/jay-gee-eff-for-web/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/ArSn/jay-gee-eff-for-web/?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/1994476894037cadfcea/maintainability)](https://codeclimate.com/github/ArSn/jay-gee-eff-for-web/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1994476894037cadfcea/test_coverage)](https://codeclimate.com/github/ArSn/jay-gee-eff-for-web/test_coverage)

# jay-gee-eff-for-web
JGF - A JSON Graph Format npm module to be used in the web (i.e. does not require nodejs to run). For more information about JSON Graph Format head over to [jsongraph/json-graph-specification](https://github.com/jsongraph/json-graph-specification#readme). 

I will not include a list of features here since this package aims to completely fulfill the specification linked above.

# Installation

with yarn
```
yarn add jay-gee-eff-for-web
```
or with npm
```
npm install jay-gee-eff-for-web
```

# Usage
## Example code

```javascript
const { JgfNode, JgfEdge, JgfGraph, JgfJsonDecorator } = require('../index');

(() => {
    console.log('Building the NBA Jgf Graph...');
    let graph = new JgfGraph('sports', 'NBA Demo Graph');

    const node1Id = 'lebron-james#2544';
    const node1Label = 'LeBron James';
    const metadata1 = {
        type: 'NBA Player',
    };

    const node2Id = 'la-lakers#1610616839';
    const node2Label = 'Los Angeles Lakers';
    const metadata2 = {
        type: 'NBA Team',
    };

    const playerContractRelation = 'Plays for';

    console.log('Adding two nodes...');
    graph.addNode(new JgfNode(node1Id, node1Label, metadata1));
    graph.addNode(new JgfNode(node2Id, node2Label, metadata2));

    console.log('Adding an edge...');
    graph.addEdge(new JgfEdge(node1Id, node2Id, playerContractRelation));

    console.log('Graph nodes:');
    for (let node of graph.nodes) {
        console.log(`\t${node.label} {${node.metadata.type}}`);
    }

    console.log('Graph edges:');
    for (let edge of graph.edges) {
        console.log(`\t${edge.source} (->${edge.relation}->) ${edge.target}`);
    }

    console.log('Full JSON representation:');
    console.log(JSON.stringify(JgfJsonDecorator.toJson(graph)));

    console.log('-- DONE --');
})();
```

### Expected console output
```
Building the NBA JGF Graph...
Adding two nodes...
Adding an edge...
Graph nodes:
	LeBron James {NBA Player}
	Los Angeles Lakers {NBA Team}
Graph edges:
	lebron-james#2544 (->Plays for->) la-lakers#1610616839
Full JSON representation:
	[... see next headline in README.md ...]
-- DONE --
```

### The JSON output from example above
```json
{
  "type": "sports",
  "label": "NBA Demo Graph",
  "directed": true,
  "nodes": [
    {
      "id": "lebron-james#2544",
      "label": "LeBron James",
      "metadata": {
        "type": "NBA Player"
      }
    },
    {
      "id": "la-lakers#1610616839",
      "label": "Los Angeles Lakers",
      "metadata": {
        "type": "NBA Team"
      }
    }
  ],
  "edges": [
    {
      "source": "lebron-james#2544",
      "target": "la-lakers#1610616839",
      "relation": "Plays for",
      "directed": true
    }
  ]
}
```

# References
## JGF specification
http://jsongraphformat.info/

## Test examples
Source: https://github.com/jsongraph/json-graph-specification/tree/master/examples