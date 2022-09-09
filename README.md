# cypress-tags

Use custom tags to slice up Cypress test runs.

See [cypress-tags-example](https://github.com/annaet/cypress-tags-example) for a working example.

This plugin uses TypeScript to parse the tests, so you will need `typescript` installed in your project.

## Install

`npm install cypress-tags`

## Setup

Add the preprocessor to your Cypress config file.

```ts
// cypress.config.ts
import { tagify } from 'cypress-tags';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', tagify(config));
    },
  },
});
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

```sh
CYPRESS_INCLUDE_TAGS=smoke,regression npx cypress run
```

Skip tests by passing a comma separated list of tags to the Cypress environment variable `CYPRESS_EXCLUDE_TAGS`.

```sh
CYPRESS_EXCLUDE_TAGS=wip npx cypress run
```

Combine the two for more complex testing strategies.

```sh
CYPRESS_INCLUDE_TAGS=smoke,regression CYPRESS_EXCLUDE_TAGS=wip npx cypress run
```

## Boolean AND your tags rather than OR

By default `cypress-tags` will either include or exclude a test if any of the tags passed in match with a tagged test.

If you wish to change this functionality you can use the `CYPRESS_INCLUDE_USE_BOOLEAN_AND` and `CYPRESS_EXCLUDE_USE_BOOLEAN_AND` environment variables.

These will only include or exclude a test if it matches **all** the tags passed in respectively.

Set the environment variables to true to trigger this behaviour:

```sh
CYPRESS_INCLUDE_USE_BOOLEAN_AND=true CYPRESS_INCLUDE_TAGS=smoke,regression npx cypress run
CYPRESS_EXCLUDE_USE_BOOLEAN_AND=true CYPRESS_EXCLUDE_TAGS=smoke,regression npx cypress run
```

## Boolean Expressions

By default `cypress-tags` uses comma separated tags for filtering tests. If you wish to use Boolean expressions in place of the default comma separated tags you can use the `CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS` environment variable.

Set the environment variables to `true` to trigger this behaviour.

```sh
CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS=true
```

### Including Tests

Select tests by passing a boolean expression of tags using **AND** and **OR** to the Cypress environment variable `CYPRESS_INCLUDE_EXPRESSION`.

```sh
CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS=true CYPRESS_INCLUDE_EXPRESSION='(smoke AND regression) AND (feature1 OR feature2)' npx cypress run
```

For the above expression only tests tagged with `["smoke", "regression", "feature1"]` or `["smoke", "regression", "feature2"]` will be included.

### Excluding Tests

Skip tests by passing a boolean expression of tags to the Cypress environment variable `CYPRESS_EXCLUDE_EXPRESSION`.

```sh
CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS=true CYPRESS_EXCLUDE_EXPRESSION='wip OR skip' npx cypress run
```

For the above expression all the tests with either wip or skip as tags are excluded.

Combine the two for more complex testing strategies.

```sh
CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS=true CYPRESS_INCLUDE_EXPRESSION='(smoke AND regression) AND (feature1 OR feature2)' CYPRESS_EXCLUDE_EXPRESSION='wip OR skip' npx cypress run
```

## Using enums as tags

If you have tags defines on an enum you can use them in your tags list.

```ts
enum Tag {
  'WIP' = 0,
  'REGRESSION' = 1,
  'SMOKE' = 2,
  'FEATURE' = 3,
}

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

```sh
CYPRESS_INCLUDE_TAGS=WIP npx cypress run
```

## Manipulating environment variables

If you want to manipulate your environment variables before passing them into the preprocessor, you can set the new env vars to use on `config.env.CYPRESS_INCLUDE_TAGS` and `config.env.CYPRESS_EXCLUDE_TAGS`.

```ts
// cypress.config.ts
import { tagify } from 'cypress-tags';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.CYPRESS_INCLUDE_TAGS = 'custom,include,tags';
      config.env.CYPRESS_EXCLUDE_TAGS = 'wip';

      on('file:preprocessor', tagify(config));
    },
  },
});
```

## Gotchas

### Programatically generated tags

As the file preprocessor runs before the Typescript file has been evaluated, you cannot programatically generate your tag names.

This means that in an example test as shown below:

```ts
it([generateTagName()], 'I will also become a wip test', () => {});
```

The `generateTagName()` function will not resolve before the tests are filtered out. The typescript code itself will be passed into the Typescript Compiler API and the generated AST will be different to what is expected by the plugin.

### Passing in environment variables

Environment variables need to be defined before running your tests, this can either be set inline or via an external file such as your `.bashrc`.

If you are a Windows user the example commands may not work for you (which assume you are executing cypress from the bash or git bash terminal, both of which accept you passing env variables before executing cypress. The windows terminal, CMD, or Powershell don't). You may need to use the Windows [set](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/set_1) command instead,

For example:

```sh
set CYPRESS_INCLUDE_TAGS=smoke npx cypress run
```

or an easier option, move the CYPRESS_INCLUDE_TAGS variable and put it after the --env option

```sh
npx cypress run --env CYPRESS_INCLUDE_TAGS=smoke
```
