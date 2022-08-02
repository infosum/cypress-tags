import browserify from 'browserify';
import through from 'through';

// @ts-ignore
const transform = require('../../dist').transform;

const generateConfig = () => {
  return {
    env: {
      CYPRESS_INCLUDE_TAGS: undefined,
      CYPRESS_EXCLUDE_TAGS: undefined,
    },
  } as unknown as Cypress.PluginConfigOptions;
};

const resetConfig = (config: Cypress.PluginConfigOptions) => {
  delete config.env.CYPRESS_INCLUDE_TAGS;
  delete config.env.CYPRESS_EXCLUDE_TAGS;
  delete config.env.CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS;
  delete config.env.CYPRESS_INCLUDE_EXPRESSION;
  delete config.env.CYPRESS_EXCLUDE_EXPRESSION;
};

const tagify = (config: Cypress.PluginConfigOptions, fileName: string, output: string[] = []): Promise<string[]> => {
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
        .add(`${__dirname}/../../cypress/e2e/${fileName}.cy.ts`)
        .bundle()
        .pipe(through(ondata, onend));

      let data = ''
      function ondata(d: string) { data += d }
      function onend() {
        const lines = data.split(/\r?\n/)
        const startline = lines.indexOf('// sample start') + 1;
        const endline = lines.length - 3;

        output = lines.slice(startline, endline);
        resolve(output);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export {
  generateConfig,
  resetConfig,
  tagify,
};
