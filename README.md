# cypress-tags

Use custom tags to slice up Cypress test runs.

See [cypress-tags-example](https://github.com/annaet/cypress-tags-example) for a working example.

## Install

`npm install cypress-tags`

## Setup

Import the `cypress-tags` functions you wish to use tags with in your support file:

```ts
// cypress/support/index.js

import 'cypress-tags/it';
```

Reference `cypress-tags` instead of `cypress` to get new type definitions.

```ts
// cypress/support/index.d.ts

/// <reference types='cypress-tags' />
```

## Usage

Add optional tags list to Cypress test commands.

```ts
it(['wip'], 'This will run with WIP tag', function () { ... });
```

Select tests by passing a comma separated list of tags to the Cypress environment variable `CYPRESS_INCLUDE_TAGS`.

```bash
CYPRESS_INCLUDE_TAGS=smoke,regression npx cypress run
```

Skip tests by passing a comma separated list of tags to the Cypress environment variable `CYPRESS_EXCLUDE_TAGS`.


```bash
CYPRESS_EXCLUDE_TAGS=wip npx cypress run
```
