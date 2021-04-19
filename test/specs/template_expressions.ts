/// <reference types="cypress" />

import 'mocha';

import { expect } from 'chai';

import {
  generateConfig,
  resetConfig,
  tagify,
} from '../helpers/tagify';

describe('Template expressions', function () {
  let output: string[] = [];
  let config = generateConfig();

  beforeEach(() => {
    resetConfig(config);
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config, 'template_expressions');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "const foo = 'bar';",
        "describe(`Run tests with no tags ${foo}`, () => {",
        "    it(`I am a regular test`, () => { });",
        "    it(`I am a regular test ${foo}`, () => { });",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    it(`I am a wip test ${foo}`, () => { });",
        "});",
        "describe(`Run tests with wip tag ${foo}`, () => {",
        "    it(`I am a regular test ${foo}`, () => { });",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    it(`I am a wip test ${foo}`, () => { });",
        "});",
      ]);
    });
  });

  describe('Describe block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'wip';
      output = await tagify(config, 'template_expressions');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "const foo = 'bar';",
        "describe(`Run tests with no tags ${foo}`, () => {",
        "    ;",
        "    ;",
        "    ;",
        "    it(`I am a wip test ${foo}`, () => { });",
        "});",
        "describe(`Run tests with wip tag ${foo}`, () => {",
        "    it(`I am a regular test ${foo}`, () => { });",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    it(`I am a wip test ${foo}`, () => { });",
        "});",
      ]);
    });
  });

  describe('It block include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke';
      output = await tagify(config, 'template_expressions');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "const foo = 'bar';",
        "describe(`Run tests with no tags ${foo}`, () => {",
        "    ;",
        "    ;",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    ;",
        "});",
        "describe(`Run tests with wip tag ${foo}`, () => {",
        "    ;",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    ;",
        "});",
      ]);
    });
  });

  describe('Exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_EXCLUDE_TAGS = 'wip';
      output = await tagify(config, 'template_expressions');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "const foo = 'bar';",
        "describe(`Run tests with no tags ${foo}`, () => {",
        "    it(`I am a regular test`, () => { });",
        "    it(`I am a regular test ${foo}`, () => { });",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    ;",
        "});",
        ";",
      ]);
    });
  });

  describe('Include and exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS = 'smoke,regression';
      config.env.CYPRESS_EXCLUDE_TAGS = 'wip';
      output = await tagify(config, 'template_expressions');
    });

    it('should output all tests without tags', function () {
      expect(output).to.deep.equal([
        "const foo = 'bar';",
        "describe(`Run tests with no tags ${foo}`, () => {",
        "    ;",
        "    ;",
        "    it(`I am a smoke test ${foo}`, () => { });",
        "    ;",
        "});",
        ";",
      ]);
    });
  });
});
