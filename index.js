define("node_modules/cypress/types/net-stubbing", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/// <reference path='../types/index.d.ts' />
var isMochaFunc = function (fn) { return typeof fn === 'function'; };
var isMochaTitle = function (title) { return typeof title === 'string'; };
var isMochaTags = function (title) { return typeof title === 'object'; };
var mochaIt = it;
var itWithTags = function (p1, p2, p3) {
    var includeTags = Cypress.env('INCLUDE_TAGS') ? Cypress.env('INCLUDE_TAGS').split(',') : [];
    var excludeTags = Cypress.env('EXCLUDE_TAGS') ? Cypress.env('EXCLUDE_TAGS').split(',') : [];
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
        var tags = p1;
        var title = p2;
        var fn = p3;
        if (includeTags.length || excludeTags.length) {
            var includeTest = false;
            var excludeTest = false;
            includeTest = includeTags.length === 0 || tags.some(function (tag) { return includeTags.includes(tag); });
            excludeTest = excludeTags.length > 0 && tags.some(function (tag) { return excludeTags.includes(tag); });
            var runTest = includeTest && !excludeTest;
            if (runTest) {
                // Include tag found, run test
                return mochaIt(title, fn);
            }
            else {
                // Include tag not found or excluded tag found, skip test
                return;
            }
        }
        else {
            // If not tags have been provided, run all tests
            return mochaIt(title, fn);
        }
    }
};
// Pass through OG mocha it methods
itWithTags.skip = mochaIt.skip;
itWithTags.only = mochaIt.only;
itWithTags.retries = mochaIt.retries;
it = itWithTags;
define("src/index", ["require", "exports", "./it"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
