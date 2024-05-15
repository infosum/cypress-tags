# Changelog

All notable changes to this project will be documented in this file.

## [1.2.7] - 2024-05-15

### Changed

- Fix npm publish action. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.6] - 2024-05-15

### Changed

- Use JS-DevTools/npm-publish@v3 to publish. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.5] - 2024-05-15

### Changed

- Fix npm publish action. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.4] - 2024-05-15

### Changed

- Fix npm publish action. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.3] - 2024-05-15

### Changed

- Fix npm publish action. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.2] - 2024-05-15

### Changed

- Fix npm publish action. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.1] - 2024-05-15

### Changed

- Add npm publish action. Closes [264](https://github.com/infosum/cypress-tags/issues/264).

## [1.2.0] - 2024-05-14

### Changed

- Upgrade dependencies to latest. Closes [262](https://github.com/infosum/cypress-tags/issues/262).

## [1.1.2] - 2022-09-21

### Changed

- Fix broken build. Closes [225](https://github.com/infosum/cypress-tags/issues/225).

## [1.1.1] - 2022-09-20

### Changed

- Transfer ownership from `annaet` to `infosum` and update repo links.

## [1.1.0] - 2022-09-20

### Changed

- Enable `cypress-tags` to be used with Cypress v6 and upwards. Closes [216](https://github.com/infosum/cypress-tags/issues/216).
- Updated dependencies.

## [1.0.2] - 2022-09-08

### Changed

- Remove module.exports preventing `tagify` function from exporting correctly. Closes [211](https://github.com/infosum/cypress-tags/issues/211).

## [1.0.1] - 2022-09-06

### Changed

- Export `tagify` function. Closes [205](https://github.com/infosum/cypress-tags/issues/205).

## [1.0.0] - 2022-08-02

### Changed

- Updated to Cypress v10 and other dependancies to latest. Closes [179](https://github.com/infosum/cypress-tags/issues/179).
- Added support for boolean expressions. Closes [166](https://github.com/infosum/cypress-tags/issues/166).

## [0.3.0] - 2021-09-27

### Changed

- Fixed issue [#100](https://github.com/infosum/cypress-tags/issues/100) where `cypress` was not defined as a peer dependency. Credit to @TomaszG.
- Updated dependencies.


## [0.2.0] - 2021-07-12

### Changed

- Fixed bug [#58](https://github.com/infosum/cypress-tags/issues/58) where `createEmptyStatement` was incompatible with a newer version of TypeScript. Replaced with `createOmittedExpression`. Credit to @omjokine!
- Updated dependencies.


## [0.1.0] - 2021-05-25

### Added

- Added new environment variables `CYPRESS_INCLUDE_USE_BOOLEAN_AND` and `CYPRESS_EXCLUDE_USE_BOOLEAN_AND` to allow a user to boolean AND tags together when including or excluding. Closes [#34](https://github.com/infosum/cypress-tags/issues/34).
- Added support for `xit` and `xdescribe`. Closes [#47](https://github.com/infosum/cypress-tags/issues/47).

### Changed

- Updated Cypress to v7.4.0 and other dependancies to latest.
- Fixed bug [#25](https://github.com/infosum/cypress-tags/issues/25) where tagged describe blocks were being ignored completely when the `CYPRESS_INCLUDE_TAGS` env var included tags that did not match the describe block. Now `cypress-tags` should fall through to the inner test blocks and check those for tags instead.
- Updated README to explain why using Cypress's `--env` CLI argument does not work as referenced in [#35](https://github.com/infosum/cypress-tags/issues/35).


## [0.0.21] - 2021-03-28

### Added

- Added tests for `.only`
- Added tests for `.skip`

### Changed

- Fixed bug [#18](https://github.com/infosum/cypress-tags/issues/18) where tests including a `.skip` were not being evaluated for tags.
- Fixes bug [#19](https://github.com/infosum/cypress-tags/issues/19) where tests including a `.only` were not being evaluated for tags.
- Refactor common helper code out of test files and into `helpers/tagify`.
- Refactor common code for evaluating whether code block has tags into `checkBlockForTags` function.
- Updated Cypress to v6.8.0 and other dependancies to latest.


## [0.0.20] - 2021-02-24

### Added

- Added this CHANGELOG file.

### Changed

- Fixed bug [#16](https://github.com/infosum/cypress-tags/issues/16) where template literal in title property has no embedded expression was causing test to always be run.
- Updated Cypress to v6.5.0 and other dependancies to latest.
