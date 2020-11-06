// Project: https://www.cypress.io
// GitHub:  https://github.com/cypress-io/cypress
// Definitions by: Gert Hengeveld <https://github.com/ghengeveld>
//                 Mike Woudenberg <https://github.com/mikewoudenberg>
//                 Robbert van Markus <https://github.com/rvanmarkus>
//                 Nicholas Boll <https://github.com/nicholasboll>
// TypeScript Version: 3.4
// Updated by the Cypress team: https://www.cypress.io/about/

/// <reference path="../node_modules/cypress/types/cy-blob-util.d.ts" />
/// <reference path="../node_modules/cypress/types/cy-bluebird.d.ts" />
/// <reference path="../node_modules/cypress/types/cy-moment.d.ts" />
/// <reference path="../node_modules/cypress/types/cy-minimatch.d.ts" />
/// <reference path="../node_modules/cypress/types/cy-chai.d.ts" />
/// <reference path="../node_modules/cypress/types/lodash/index.d.ts" />
/// <reference path="../node_modules/cypress/types/sinon/index.d.ts" />
/// <reference path="../node_modules/cypress/types/sinon-chai/index.d.ts" />

// Override mocha types reference with our own definitions
/// <reference path="./mocha.d.ts" />

/// <reference path="../node_modules/cypress/types/jquery/index.d.ts" />
/// <reference path="../node_modules/cypress/types/chai-jquery/index.d.ts" />

// jQuery includes dependency "sizzle" that provides types
// so we include it too in "node_modules/sizzle".
// This way jQuery can load it using 'reference types="sizzle"' directive

// load ambient declaration for "cypress" NPM module
// hmm, how to load it better?
/// <reference path="../node_modules/cypress/types/cypress-npm-api.d.ts" />

/// <reference path="../node_modules/cypress/types/net-stubbing.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress-global-vars.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress-type-helpers.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress-expect.d.ts" />
