/// <reference path='../types/index.d.ts' />

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
  skipIfUntagged?: boolean,
  subFnName?: MochaSubFns,
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

        // Weird edge case found in Cypress code too
        // See packages/driver/src/cypress/mocha.js line #76
        // Haven't figured out how to make this work yet
        if (subFnName === 'only') {
          throw new Error('.only currently unsupported');
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

  if (includeTags.length && skipIfUntagged) {
    // If include tags have been provided, skip any untagged tests
    return;
  }

  // @ts-ignore
  return origFn(...args);
};

const overloadMochaFnForTags = (fnName: MochaFns, skipIfUntagged?: boolean) => {
  const _fn = window[fnName];

  const overrideFn = (fn: any) => {
    window[fnName] = fn();
    (window[fnName]).only = fn('only');
    (window[fnName]).skip = fn('skip');
  };

  overrideFn((subFn?: MochaSubFns) => {
    return (...args: any[]) => {
      const origFn = subFn ? _fn[subFn] : _fn;
      return filterTest(args, origFn, skipIfUntagged, subFn);
    };
  });
};

overloadMochaFnForTags('it', true);
overloadMochaFnForTags('test', true);
overloadMochaFnForTags('specify', true);

overloadMochaFnForTags('describe');
overloadMochaFnForTags('context');
overloadMochaFnForTags('suite');
