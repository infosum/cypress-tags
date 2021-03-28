/// <reference types="cypress" />

import 'mocha';

import { expect } from 'chai';

import {
  generateConfig,
  resetConfig,
  tagify,
} from '../helpers/tagify';

describe('Only tests', function () {
  let output: string[] = [];
  let config = generateConfig();

  beforeEach(() => {
    resetConfig(config);
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config, 'only');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Describe block', () => {",
        "    it.only('Run this test without tag', () => { });",
        "    it.only('Run this test with tag', () => { });",
        "    it('Skip this test without tag', () => { });",
        "    it('Skip this test without tag', () => { });",
        "});",
        "describe.only('Only run this describe', () => {",
        "    it.only('Run this test without tag', () => { });",
        "    it.only('Run this test with tag', () => { });",
        "    it('Skip this test without tag', () => { });",
        "    it('Skip this test without tag', () => { });",
        "});",
      ]);
    });
  });

  describe('Include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke';
      output = await tagify(config, 'only');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Describe block', () => {",
        "    ;",
        "    it.only('Run this test with tag', () => { });",
        "    ;",
        "    it('Skip this test without tag', () => { });",
        "});",
        "describe.only('Only run this describe', () => {",
        "    it.only('Run this test without tag', () => { });",
        "    it.only('Run this test with tag', () => { });",
        "    it('Skip this test without tag', () => { });",
        "    it('Skip this test without tag', () => { });",
        "});",
      ]);
    });
  });

  describe('Exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_EXCLUDE_TAGS = 'smoke';
      output = await tagify(config, 'only');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Describe block', () => {",
        "    it.only('Run this test without tag', () => { });",
        "    ;",
        "    it('Skip this test without tag', () => { });",
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
      output = await tagify(config, 'only');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Describe block', () => {",
        "    ;",
        "    it.only('Run this test with tag', () => { });",
        "    ;",
        "    it('Skip this test without tag', () => { });",
        "});",
        "describe.only('Only run this describe', () => {",
        "    it.only('Run this test without tag', () => { });",
        "    ;",
        "    it('Skip this test without tag', () => { });",
        "    ;",
        "});",
      ]);
    });
  });
});
