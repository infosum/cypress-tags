/// <reference types="cypress" />

import 'mocha';

import { expect } from 'chai';

import {
  generateConfig,
  resetConfig,
  tagify,
} from '../helpers/tagify';

describe('Skipped tests', function () {
  let output: string[] = [];
  let config = generateConfig();

  beforeEach(() => {
    resetConfig(config);
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config, 'skip');
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

  describe('Describe block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke';
      output = await tagify(config, 'skip');
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
        "    it.skip('Skipped test', () => { });",
        "    it.skip('Skipped test', () => { });",
        "    it('Unskipped test', () => { });",
        "    it('Tagged test', () => { });",
        "});",
      ]);
    });
  });

  describe('It block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'wip';
      output = await tagify(config, 'skip');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    ;",
        "    ;",
        "    ;",
        "    ;",
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
      output = await tagify(config, 'skip');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    it.skip('Skipped test', () => { });",
        "    ;",
        "    it('Unskipped test', () => { });",
        "    ;",
        "});",
        ";",
      ]);
    });
  });

  describe('Include and exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke';
      config.env.CYPRESS_EXCLUDE_TAGS = 'wip';
      output = await tagify(config, 'skip');
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
        "    it.skip('Skipped test', () => { });",
        "    ;",
        "    it('Unskipped test', () => { });",
        "    ;",
        "});",
      ]);
    });
  });
});
