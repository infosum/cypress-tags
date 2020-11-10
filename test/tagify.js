const through = require('through');
const browserify = require('browserify');
const expect = require('chai').expect;
const transform = require('../dist/tagify').transform;

describe('Tagify', function() {
  let output = '';

  before(() => {
    return new Promise((resolve) => {
      const options = {
        ...browserify.defaultOptions,
        typescript: require.resolve('typescript'),
      };

      try {
        // tagify().transform(__dirname + '/../example/sample.ts');
        browserify(options)
          .transform(transform)
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
        expect(err).to.not.exist;
      }
    });
  });

  it('should not edit tests without tags', function() {
    expect(output.slice(0, 3)).to.deep.equal([
      `describe('No tag tests', () => {`,
      `    it('I am a regular test', () => { });`,
      `});`,
    ]);
  });

  it('should not remove tags from describe block', function() {
    expect(output[3]).to.equal(`describe(['wip'], 'WIP tests', () => {`);
  });

  it('should add parent tags to test without tags', function() {
    expect(output[4]).to.equal(`    it(['wip'], 'I will become a wip test', () => { });`);
  });

  it('should append parent tags to test with tags', function() {
    expect(output[5]).to.equal(`    it(['feature', 'wip'], 'I will also become a wip test', () => { });`);
  });

  it('should not add parent tags to test with the same tags', function() {
    expect(output[6]).to.equal(`    it(['wip'], 'I am already a wip test', () => { });`);
  });
});