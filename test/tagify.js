const through = require('through');
const browserify = require('browserify');
const expect = require('chai').expect;
const transform = require('../dist/tagify').transform;

describe('Tagify', function() {
  it('should return it statements with parent tags added', function() {
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

      var data = ''
      function ondata(d) { data += d }
      function onend() {
        var lines = data.split('\n')
        var startline = lines.indexOf('// sample start') + 1,
            endline = lines.indexOf('// sample end');

        const l = lines.slice(startline, endline);

        expect(lines.slice(startline, endline)).to.deep.equal([
          `describe('No tag tests', () => {`,
          `    it('I am a regular test', () => { });`,
          `});`,
          `describe(['wip'], 'WIP tests', () => {`,
          `    it(['wip'], 'I will become a wip test', () => { });`,
          `    it(['feature', 'wip'], 'I will also become a wip test', () => { });`,
          `    it(['wip'], 'I am already a wip test', () => { });`,
          `});`,
        ]);
      }
    } catch (err) {
      expect(err).to.not.exist;
    }
  });
});