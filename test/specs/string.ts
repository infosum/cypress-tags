/// <reference types="cypress" />

import 'mocha';

import { expect } from 'chai';

import {
  generateConfig,
  resetConfig,
  tagify,
} from '../helpers/tagify';

describe('String tags', function () {
  let output: string[] = [];
  let config = generateConfig();

  beforeEach(() => {
    resetConfig(config);
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        "    it('I am a regular test', () => { });",
        "});",
        "describe('Run tests with tagged describe block', () => {",
        "    it('I will become a wip test', () => { });",
        "    it('I will also become a wip test', () => { });",
        "    it('I am already a wip test', () => { });",
        "    it.skip('I should always be skipped', () => { });",
        "});",
        "describe('Run tests with tagged it statements', () => {",
        "    it('I am a wip test', () => { });",
        "    it('I am a smoke & regression test', () => { });",
        "    it('I am a regression test', () => { });",
        "    it('I am a smoke test', () => { });",
        "    it('I am a wip smoke test', () => { });",
        "    it.skip('I have tags and should always be skipped', () => { });",
        "});",
      ]);
    });
  });

  describe('Describe block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'wip';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        "    ;",
        "});",
        "describe('Run tests with tagged describe block', () => {",
        "    it('I will become a wip test', () => { });",
        "    it('I will also become a wip test', () => { });",
        "    it('I am already a wip test', () => { });",
        "    it.skip('I should always be skipped', () => { });",
        "});",
        "describe('Run tests with tagged it statements', () => {",
        "    it('I am a wip test', () => { });",
        "    ;",
        "    ;",
        "    ;",
        "    it('I am a wip smoke test', () => { });",
        "    it.skip('I have tags and should always be skipped', () => { });",
        "});",
      ]);
    });
  });

  describe('It block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'feature';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        "    ;",
        "});",
        "describe('Run tests with tagged describe block', () => {",
        "    ;",
        "    it('I will also become a wip test', () => { });",
        "    ;",
        "    ;",
        "});",
        "describe('Run tests with tagged it statements', () => {",
        "    ;",
        "    ;",
        "    ;",
        "    ;",
        "    ;",
        "    ;",
        "});",
      ]);
    });
  });

  describe('Exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_EXCLUDE_TAGS = 'wip';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        "    it('I am a regular test', () => { });",
        "});",
        ";",
        "describe('Run tests with tagged it statements', () => {",
        "    ;",
        "    it('I am a smoke & regression test', () => { });",
        "    it('I am a regression test', () => { });",
        "    it('I am a smoke test', () => { });",
        "    ;",
        "    ;",
        "});",
      ]);
    });
  });

  describe('Include and exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke,regression';
      config.env.CYPRESS_EXCLUDE_TAGS = 'wip';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        "    ;",
        "});",
        ";",
        "describe('Run tests with tagged it statements', () => {",
        "    ;",
        "    it('I am a smoke & regression test', () => { });",
        "    it('I am a regression test', () => { });",
        "    it('I am a smoke test', () => { });",
        "    ;",
        "    ;",
        "});",
      ]);
    });
  });
  
  describe('Simple include expression with AND provided', () => {
    before(async () => {
      config.env.CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS = true;
      config.env.CYPRESS_INCLUDE_EXPRESSION = 'smoke AND regression';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        '    ;',
        '});',
        "describe('Run tests with tagged describe block', () => {",
        '    ;',
        '    ;',
        '    ;',
        '    ;',
        '});',
        "describe('Run tests with tagged it statements', () => {",
        '    ;',
        "    it('I am a smoke & regression test', () => { });",
        '    ;',
        '    ;',
        '    ;',
        "    it.skip('I have tags and should always be skipped', () => { });",
        '});'
      ]);
    });
  });
  
  describe('Simple include expression with OR provided', () => {
    before(async () => {
      config.env.CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS = true;
      config.env.CYPRESS_INCLUDE_EXPRESSION = 'smoke OR regression';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        '    ;',
        '});',
        "describe('Run tests with tagged describe block', () => {",
        '    ;',
        '    ;',
        '    ;',
        '    ;',
        '});',
        "describe('Run tests with tagged it statements', () => {",
        '    ;',
        "    it('I am a smoke & regression test', () => { });",
        "    it('I am a regression test', () => { });",
        "    it('I am a smoke test', () => { });",
        "    it('I am a wip smoke test', () => { });",
        "    it.skip('I have tags and should always be skipped', () => { });",
        '});'
      ]);
    });
  });

  describe('Simple include and exclude Expression', () => {
    before(async () => {
      config.env.CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS = true;
      config.env.CYPRESS_INCLUDE_EXPRESSION = 'smoke OR regression';
      config.env.CYPRESS_EXCLUDE_EXPRESSION = 'wip';
      output = await tagify(config, 'string');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Run tests with no tags', () => {",
        '    ;',
        '});',
        ';',
        "describe('Run tests with tagged it statements', () => {",
        '    ;',
        "    it('I am a smoke & regression test', () => { });",
        "    it('I am a regression test', () => { });",
        "    it('I am a smoke test', () => { });",
        '    ;',
        '    ;',
        '});'
      ]);
    });
  });
});
