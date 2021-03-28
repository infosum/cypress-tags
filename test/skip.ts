/// <reference types="cypress" />

import 'mocha';

import browserify from 'browserify';
import { expect } from 'chai';
import through from 'through';

// @ts-ignore
const transform = require('../dist').transform;

describe('Skipped tests', function () {
  let output: string[] = [];
  let config = {
    env: {
      CYPRESS_INCLUDE_TAGS: undefined,
      CYPRESS_EXCLUDE_TAGS: undefined,
    },
  } as unknown as Cypress.PluginConfigOptions;

  const tagify = (config: Cypress.PluginConfigOptions): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const options = {
        typescript: require.resolve('typescript'),
        extensions: ['.js', '.ts'],
        plugin: [
          ['tsify']
        ],
      };

      try {
        browserify(options)
          .transform((fileName: string) => transform(fileName, config))
          .add(__dirname + '/../cypress/integration/skip.spec.ts')
          .bundle()
          .pipe(through(ondata, onend));

        let data = ''
        function ondata(d: string) { data += d }
        function onend() {
          const lines = data.split('\n')
          const startline = lines.indexOf('// sample start') + 1;
          const endline = lines.length - 3;

          output = lines.slice(startline, endline);
          resolve(output);
        }
      } catch (err) {
        console.log('I have an error');
        reject(err);
      }
    });
  };

  beforeEach(() => {
    delete config.env.CYPRESS_INCLUDE_TAGS;
    delete config.env.CYPRESS_EXCLUDE_TAGS;
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config);
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    it.skip('Skipped test', () => { });",
        "    it.skip('Skipped test', () => { });",
        "    it('Unskipped test', () => { });",
        "    it('Tagged test', () => { });",
        "});",
        "describe.skip('Skipped describe', () => {",
        "    it.skip('Skipped test', () => { });",
        "    it.skip('Skipped test', () => { });",
        "    it('Unskipped test', () => { });",
        "    it('Tagged test', () => { });",
        "});",
      ]);
    });
  });

  describe('Include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke';
      output = await tagify(config);
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    ;",
        "    it.skip('Skipped test', () => { });",
        "    ;",
        "    it('Tagged test', () => { });",
        "});",
        "describe.skip('Skipped describe', () => {",
        "    ;",
        "    it.skip('Skipped test', () => { });",
        "    ;",
        "    it('Tagged test', () => { });",
        "});",
      ]);
    });
  });

  describe('Exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_EXCLUDE_TAGS = 'smoke';
      output = await tagify(config);
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    it.skip('Skipped test', () => { });",
        "    ;",
        "    it('Unskipped test', () => { });",
        "    ;",
        "});",
        "describe.skip('Skipped describe', () => {",
        "    it.skip('Skipped test', () => { });",
        "    ;",
        "    it('Unskipped test', () => { });",
        "    ;",
        "});",
      ]);
    });
  });
});
