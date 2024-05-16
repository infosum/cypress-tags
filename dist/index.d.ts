/// <reference path="../types/index.d.ts" />
/// <reference types="cypress" />
/// <reference types="cypress" />
/// <reference types="cypress" />
/// <reference types="cypress" />
import through from 'through';
export declare const transform: (fileName: string, config: Cypress.PluginConfigOptions) => through.ThroughStream;
declare const preprocessor: (config: Cypress.PluginConfigOptions) => any;
export { preprocessor as tagify };
