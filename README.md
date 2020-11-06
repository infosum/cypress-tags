# cypress-tags

Use custom tags to slice up Cypress test runs.

## Install

`npm install cypress-tags`

## Setup

Import the `cypress-tags` functions you wish to use tags with in your support file:

```
// cypress/support/index.js

import 'cypress-tags/it';
```

Reference `cypress-tags` instead of `cypress` to get new type definitions.

```
// cypress/support/index.d.ts

/// <reference types='cypress-tags' />
```

## Usage

Add optional tags list to Cypress test commands.

```
it(['wip'], 'This will run with WIP tag', function () { ... });
```

Select tests using Cypress environment variable `CYPRESS_TAGS`.

```
CYPRESS_TAGS=wip npx cypress run
```

Skip tests using Cypress environment variable `CYPRESS_NOT_TAGS`.


```
CYPRESS_NOT_TAGS=wip npx cypress run
```
