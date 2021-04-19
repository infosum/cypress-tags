/// <reference types="cypress" />

import 'mocha';

import { expect } from 'chai';

import {
  generateConfig,
  resetConfig,
  tagify,
} from '../helpers/tagify';

describe('Enum tags', function () {
  let output: string[] = [];
  let config = generateConfig();

  beforeEach(() => {
    resetConfig(config);
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config, 'enum');
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
      config.env.CYPRESS_INCLUDE_TAGS = 'WIP';
      output = await tagify(config, 'enum');
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
      config.env.CYPRESS_INCLUDE_TAGS = 'FEATURE';
      output = await tagify(config, 'enum');
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
      config.env.CYPRESS_EXCLUDE_TAGS = 'WIP';
      output = await tagify(config, 'enum');
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
      config.env.CYPRESS_INCLUDE_TAGS = 'SMOKE,REGRESSION';
      config.env.CYPRESS_EXCLUDE_TAGS = 'WIP';
      output = await tagify(config, 'enum');
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
});
