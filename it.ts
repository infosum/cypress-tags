/// <reference path='./types/index.d.ts' />
/// <reference types='cypress' />

type MochaFunc = Mocha.Func | Mocha.AsyncFunc;
type MochaTitleOrFunc = string | MochaFunc;
type MochaTagsTitleOrFunc = string[] | MochaTitleOrFunc;

const isMochaFunc = (fn: MochaTagsTitleOrFunc): fn is Mocha.Func => typeof fn === 'function';
const isMochaTitle = (title: MochaTagsTitleOrFunc): title is string => typeof title === 'string';
const isMochaTags = (title: MochaTagsTitleOrFunc): title is string[] => typeof title === 'object';

const mochaIt = it;

const itWithTags = (p1: MochaTagsTitleOrFunc, p2: MochaTitleOrFunc, p3: MochaFunc): Mocha.Test => {
  const includeTags = Cypress.env('TAGS') ? Cypress.env('TAGS').split(',') : [];
  const excludeTags = Cypress.env('NOT_TAGS') ? Cypress.env('NOT_TAGS').split(',') : [];

  if (isMochaFunc(p1)) {
    return mochaIt(p1);
  }

  if (isMochaTitle(p1) && isMochaFunc(p2)) {
    if (includeTags.length) {
      // If include tags have been provided, skip any untagged tests
      return;
    }

    return mochaIt(p1, p2);
  }

  if (isMochaTags(p1) && isMochaTitle(p2) && isMochaFunc(p3)) {
    const tags = p1;
    const title = p2;
    const fn = p3;

    if (includeTags.length || excludeTags.length) {
      let includeTest = false;
      let excludeTest = false;

      if (includeTags) {
        includeTest = tags.some(tag => includeTags.includes(tag));
      }
      if (excludeTags) {
        excludeTest = tags.some(tag => excludeTags.includes(tag));
      }

      const runTest = includeTest && !excludeTest;
      if (runTest) {
        // Include tag found, run test
        return mochaIt(title, fn);
      } else {
        // Include tag not found or excluded tag found, skip test
        return;
      }
    } else {
      // If not tags have been provided, run all tests
      return mochaIt(title, fn);
    }
  }
};

// Pass through OG mocha it methods
itWithTags.skip = mochaIt.skip;
itWithTags.only = mochaIt.only;
itWithTags.retries = mochaIt.retries;

it = itWithTags as Mocha.TestFunction;
