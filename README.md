# cypress-tags

Use custom tags to slice up Cypress test runs.

See [cypress-tags-example](https://github.com/annaet/cypress-tags-example) for a working example.

## Install

`npm install cypress-tags`

## Setup

Add the preprocessor to your plugins file.

```ts
// cypress/plugins/index.js
const tagify = require('cypress-tags');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('file:preprocessor', tagify(config));
};
```

Reference `cypress-tags` instead of `cypress` to get the new type definitions.

```ts
// cypress/support/index.d.ts
/// <reference types='cypress-tags' />
```

## Usage

Add optional tags list to Cypress test commands.

```ts
describe(['my-feature'], 'This will tag every test inside the describe with the "my-feature" tag', function () { ... });

it(['wip'], 'This is a work-in-progress test', function () { ... });
```

Select tests by passing a comma separated list of tags to the Cypress environment variable `CYPRESS_INCLUDE_TAGS`.

```bash
CYPRESS_INCLUDE_TAGS=smoke,regression npx cypress run
```

Skip tests by passing a comma separated list of tags to the Cypress environment variable `CYPRESS_EXCLUDE_TAGS`.

```bash
CYPRESS_EXCLUDE_TAGS=wip npx cypress run
```

Combine the two for more complex testing strategies.

```bash
CYPRESS_INCLUDE_TAGS=smoke,regression CYPRESS_EXCLUDE_TAGS=wip npx cypress run
```
