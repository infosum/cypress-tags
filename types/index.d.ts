// Project: https://www.cypress.io
// GitHub:  https://github.com/cypress-io/cypress
// Definitions by: Gert Hengeveld <https://github.com/ghengeveld>
//                 Mike Woudenberg <https://github.com/mikewoudenberg>
//                 Robbert van Markus <https://github.com/rvanmarkus>
//                 Nicholas Boll <https://github.com/nicholasboll>
// TypeScript Version: 3.4
// Updated by the Cypress team: https://www.cypress.io/about/

/// <reference types="cypress" />

// Add tags to mocha definitions
declare namespace Mocha {
  interface TestFunction {
    (tags: string[], title: string, fn?: Func): Test;
    (tags: string[], title: string, fn?: AsyncFunc): Test;
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn?: Func): Test
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn?: AsyncFunc): Test
  }
  interface ExclusiveTestFunction {
    (tags: string[], title: string, fn?: Func): Test;
    (tags: string[], title: string, fn?: AsyncFunc): Test;
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn?: Func): Test
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn?: AsyncFunc): Test
  }
  interface PendingTestFunction {
    (tags: string[], title: string, fn?: Func): Test;
    (tags: string[], title: string, fn?: AsyncFunc): Test;
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn?: Func): Test
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn?: AsyncFunc): Test
  }

  interface SuiteFunction {
    (tags: string[], title: string, fn: (this: Suite) => void): Suite;
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn: (this: Suite) => void): Suite
  }

  interface ExclusiveSuiteFunction {
    (tags: string[], title: string, fn: (this: Suite) => void): Suite;
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn: (this: Suite) => void): Suite
  }

  interface PendingSuiteFunction {
    (tags: string[], title: string, fn: (this: Suite) => void): Suite;
    (tags: string[], title: string, config: Cypress.TestConfigOverrides, fn: (this: Suite) => void): Suite | void
  }
}
