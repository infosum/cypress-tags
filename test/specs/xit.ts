/// <reference types="cypress" />

import 'mocha';

import { expect } from 'chai';

import {
  generateConfig,
  resetConfig,
  tagify,
} from '../helpers/tagify';

describe('Xit tests', function () {
  let output: string[] = [];
  let config = generateConfig();

  beforeEach(() => {
    resetConfig(config);
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config, 'xit');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    xit('Skipped test', () => { });",
        "    xit('Skipped test', () => { });",
        "    it('Unskipped test', () => { });",
        "    it('Tagged test', () => { });",
        "});",
        "xdescribe('Skipped describe', () => {",
        "    xit('Skipped test', () => { });",
        "    xit('Skipped test', () => { });",
        "    it('Unskipped test', () => { });",
        "    it('Tagged test', () => { });",
        "});",
      ]);
    });
  });

  describe('Describe block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke';
      output = await tagify(config, 'xit');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    ;",
        "    xit('Skipped test', () => { });",
        "    ;",
        "    it('Tagged test', () => { });",
        "});",
        "xdescribe('Skipped describe', () => {",
        "    xit('Skipped test', () => { });",
        "    xit('Skipped test', () => { });",
        "    it('Unskipped test', () => { });",
        "    it('Tagged test', () => { });",
        "});",
      ]);
    });
  });

  describe('It block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'wip';
      output = await tagify(config, 'xit');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    ;",
        "    ;",
        "    ;",
        "    ;",
        "});",
        "xdescribe('Skipped describe', () => {",
        "    ;",
        "    xit('Skipped test', () => { });",
        "    ;",
        "    it('Tagged test', () => { });",
        "});",
      ]);
    });
  });

  describe('Exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_EXCLUDE_TAGS = 'smoke';
      output = await tagify(config, 'xit');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    xit('Skipped test', () => { });",
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
      output = await tagify(config, 'xit');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "describe('Unskipped describe', () => {",
        "    ;",
        "    xit('Skipped test', () => { });",
        "    ;",
        "    it('Tagged test', () => { });",
        "});",
        "xdescribe('Skipped describe', () => {",
        "    xit('Skipped test', () => { });",
        "    ;",
        "    it('Unskipped test', () => { });",
        "    ;",
        "});",
      ]);
    });
  });
});
