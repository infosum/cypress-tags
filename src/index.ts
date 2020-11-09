/// <reference path='../types/index.d.ts' />

type MochaFns = 'it' | 'describe';
type MochaSubFns = 'only' | 'skip';
type MochaFnType = Mocha.TestFunction | Mocha.ExclusiveTestFunction | Mocha.PendingTestFunction | Mocha.SuiteFunction | Mocha.ExclusiveSuiteFunction | Mocha.PendingSuiteFunction;

const isMochaTags = (tags: any): tags is string[] => typeof tags === 'object';

const mochaDescribe = describe;
const mochaIt = it;

const extractTags = () => {
  const includeTags = Cypress.env('INCLUDE_TAGS') ? Cypress.env('INCLUDE_TAGS').split(',') : [];
  const excludeTags = Cypress.env('EXCLUDE_TAGS') ? Cypress.env('EXCLUDE_TAGS').split(',') : [];

  return {
    includeTags,
    excludeTags,
  };
};

const filterTest = (
  args: any[],
  origFn: MochaFnType,
  fnName?: string,
  subFn?: MochaSubFns,
): Mocha.Test | Mocha.Suite | undefined => {
  const { includeTags, excludeTags } = extractTags();

  if (isMochaTags(args[0])) {
    const tags = args[0];
    const cypressArgs = args.slice(1);

    if (includeTags.length || excludeTags.length) {
      let includeTest = false;
      let excludeTest = false;

      includeTest = includeTags.length === 0 || tags.some(tag => includeTags.includes(tag));
      excludeTest = excludeTags.length > 0 && tags.some(tag => excludeTags.includes(tag));

      const runTest = includeTest && !excludeTest;
      if (runTest) {
        // Include tag found, run test
        if (fnName === 'it' && args[1] === 'I am a wip smoke test') {
          // throw new Error(...args);
        }
        // Weird edge case found in Cypress code too
        // See packages/driver/src/cypress/mocha.js line #76
        if (subFn === 'only') {
          // throw new Error(origFn as unknown as string);
        }
        // @ts-ignore
        return origFn(...cypressArgs);
      } else {
        // Include tag not found or excluded tag found, skip test
        return;
      }
    } else {
      // If not tags have been provided, run all tests
      // @ts-ignore
      return origFn(...cypressArgs);
    }
  }

  if (includeTags.length) {
    // If include tags have been provided, skip any untagged tests
    return;
  }

  // @ts-ignore
  return origFn(...args);
};

const overloadMochaFnForTags = (fnName: MochaFns) => {
  const _fn = window[fnName];

  const overrideFn = (fn: any) => {
    window[fnName] = fn();
    (window[fnName]).only = fn('only');
    (window[fnName]).skip = fn('skip');
    // if ((window[fnName]).retries) {
    //   (window[fnName]).retries = fn('retries');
    // }
  };

  overrideFn((subFn?: MochaSubFns) => {
    return (...args: any[]) => {
      const origFn = subFn ? _fn[subFn] : _fn;
      // const origFn = _fn;
      return filterTest(args, origFn, fnName, subFn);
    };
  });
};

overloadMochaFnForTags('it');
overloadMochaFnForTags('describe');

// Pass through OG mocha it methods
// describeWithTags.skip = mochaDescribe.skip;
// describeWithTags.only = mochaDescribe.only;
// itWithTags.skip = mochaIt.skip;
// itWithTags.only = mochaIt.only;
// itWithTags.retries = mochaIt.retries;

// // Overwrite globals
// describe = describeWithTags as Mocha.SuiteFunction;
// it = itWithTags as Mocha.TestFunction;
