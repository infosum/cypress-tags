const through = require('through');
const browserify = require('browserify');
const expect = require('chai').expect;
const transform = require('../dist').transform;

const tagify = (config) => {
  return new Promise((resolve) => {
    const options = {
      ...browserify.defaultOptions,
      typescript: require.resolve('typescript'),
    };

    try {
      browserify(options)
        .transform((fileName) => transform(fileName, config))
        .add(__dirname + '/../example/sample.ts')
        .bundle()
        .pipe(through(ondata, onend));

      let data = ''
      function ondata(d) { data += d }
      function onend() {
        const lines = data.split('\n')
        const startline = lines.indexOf('// sample start') + 1;
        const endline = lines.indexOf('// sample end');

        output = lines.slice(startline, endline);
        resolve(output);
      }
    } catch (err) {
      console.log('I have an error');
      reject(output);
    }
  });
};

describe('Tagify', function() {
  let output = '';
  let config = {
    env: {},
  };

  beforeEach(() => {
    delete config.env.CYPRESS_INCLUDE_TAGS;
    delete config.env.CYPRESS_EXCLUDE_TAGS;
  });

  describe('No tags provided', () => {
    before(async () => {
      output = await tagify(config);
    });

    it('should output all tests without tags', function() {
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

  describe('Include tags provided', () => {
    before(async () => {
      config.env.CYPRESS_INCLUDE_TAGS='wip';
      output = await tagify(config);
    });

    it('should output all tests without tags', function() {
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

  describe('Exclude tags provided', () => {
    before(async () => {
      config.env.CYPRESS_EXCLUDE_TAGS='wip';
      output = await tagify(config);
    });

    it('should output all tests without tags', function() {
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
      config.env.CYPRESS_INCLUDE_TAGS='smoke,regression';
      config.env.CYPRESS_EXCLUDE_TAGS='wip';
      output = await tagify(config);
    });

    it('should output all tests without tags', function() {
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