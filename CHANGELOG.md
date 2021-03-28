# Changelog

All notable changes to this project will be documented in this file.

## [0.0.21] - 2021-03-28

### Added

- Added tests for `.only`
- Added tests for `.skip`

### Changed

- Fixed bug [#18](https://github.com/annaet/cypress-tags/issues/18) where tests including a `.skip` were not being evaluated for tags.
- Fixes bug [#19](https://github.com/annaet/cypress-tags/issues/19) where tests including a `.only` were not being evaluated for tags.
- Refactor common helper code out of test files and into `helpers/tagify`.
- Refactor common code for evaluating whether code block has tags into `checkBlockForTags` function.
- Updated Cypress to v6.8.0 and other dependancies to latest.


## [0.0.20] - 2021-02-24

### Added

- Added this CHANGELOG file.
  
### Changed

- Fixed bug [#16](https://github.com/annaet/cypress-tags/issues/16) where template literal in title property has no embedded expression was causing test to always be run.
- Updated Cypress to v6.5.0 and other dependancies to latest.
