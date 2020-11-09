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

declare global {
  interface Window {
    it: Mocha.TestFunction;
    test: Mocha.TestFunction;
    specify: Mocha.TestFunction;

    describe: Mocha.SuiteFunction;
    context: Mocha.SuiteFunction;
    suite: Mocha.SuiteFunction;
  }
}

type MochaFnName = 'it' | 'test' | 'specify' | 'describe' | 'context' | 'suite';
type MochaSubFnName = 'only' | 'skip';
type MochaFnType = Mocha.TestFunction | Mocha.ExclusiveTestFunction | Mocha.PendingTestFunction | Mocha.SuiteFunction | Mocha.ExclusiveSuiteFunction | Mocha.PendingSuiteFunction;

window.it = window.it || {};
window.test = window.it || {};
window.specify = window.it || {};

window.describe = window.describe || {};
window.context = window.context || {};
window.suite = window.suite || {};