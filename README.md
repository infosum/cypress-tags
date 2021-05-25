# cypress-tags

Use custom tags to slice up Cypress test runs.

See [cypress-tags-example](https://github.com/annaet/cypress-tags-example) for a working example.

This plugin uses TypeScript to parse the tests, so you will need `typescript` installed in your project.

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

## Boolean AND your tags rather than OR

By default `cypress-tags` will either include or exclude a test if any of the tags passed in match with a tagged test.

If you wish to change this functionality you can use the `CYPRESS_INCLUDE_USE_BOOLEAN_AND` and `CYPRESS_EXCLUDE_USE_BOOLEAN_AND` environment variables.

These will only include or exclude a test if it matches **all** the tags passed in respectively.

Set the environment variables to true to trigger this behaviour:

```bash
CYPRESS_INCLUDE_USE_BOOLEAN_AND=true CYPRESS_INCLUDE_TAGS=smoke,regression npx cypress run
CYPRESS_EXCLUDE_USE_BOOLEAN_AND=true CYPRESS_EXCLUDE_TAGS=smoke,regression npx cypress run
```

## Using enums as tags

If you have tags defines on an enum you can use them in your tags list.

```ts
enum Tag {
  'WIP' = 0,
  'REGRESSION' = 1,
  'SMOKE' = 2,
  'FEATURE' = 3,
};

describe([Tag.WIP], 'Run tests with tagged describe block', () => {
  it('I will become a wip test', () => {});
  it([Tag.FEATURE], 'I will also become a wip test', () => {});
  it([Tag.WIP], 'I am already a wip test', () => {});
  it.skip('I should always be skipped', () => {});
});
```

To account for numeric enums the enum **member name** is used as the tag instead of the value.

This means to run the tests above tagged with `Tag.WIP` you would use the string `WIP` as your include tag, instead of the enum value `0`.

For example:

```bash
CYPRESS_INCLUDE_TAGS=WIP npx cypress run
```

## Manipulating environment variables

If you want to manipulate your environment variables before passing them into the preprocessor, you can set the new env vars to use on `config.env.CYPRESS_INCLUDE_TAGS` and `config.env.CYPRESS_EXCLUDE_TAGS`.

```ts
// cypress/plugins/index.js
const tagify = require('cypress-tags');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  config.env.CYPRESS_INCLUDE_TAGS = 'custom,include,tags';
  config.env.CYPRESS_EXCLUDE_TAGS = 'wip';

  on('file:preprocessor', tagify(config));
};
```

## Gotchas

### Programatically generated tags

As the file preprocessor runs before the Typescript file has been evaluated, you cannot programatically generate your tag names.

This means that in an example test as shown below:

```
  it([generateTagName()], 'I will also become a wip test', () => {});
```

The `generateTagName()` function will not resolve before the tests are filtered out. The typescript code itself will be passed into the Typescript Compiler API and the generated AST will be different to what is expected by the plugin.

### Passing in environtment variables

Environment variables need to be defined before running your tests, this can either be set inline or via an external file such as your `.bashrc`.

Setting environment variables via Cypress's `--env` CLI argument will **not** work. As stated in the Cypress [documentation](https://docs.cypress.io/guides/guides/environment-variables#Setting):

> In Cypress, "environment variables" are variables that are accessible via Cypress.env. These are not the same as OS-level environment variables.
