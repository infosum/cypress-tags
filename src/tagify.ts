import through from 'through';
import ts, { factory } from 'typescript';

const browserify = require('@cypress/browserify-preprocessor');

const isTestBlock = (name: string) => (node: ts.Node) => {
  return ts.isExpressionStatement(node) &&
    ts.isCallExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.escapedText === name;
};

const isDescribe = isTestBlock('describe');
const isContext = isTestBlock('context');
const isIt = isTestBlock('it');

const parseChildren = (nodes: ts.Node, parentTags: string[]) => {
  nodes.forEachChild((node) => {
    // Check child nodes have correct types
    if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) && ts.isIdentifier(node.expression.expression)) {
      const firstArg = node.expression.arguments[0];

      if (isDescribe(node) || isContext(node)) {
        if (ts.isStringLiteral(firstArg)) {
          // First arg is title

          const fn = node.expression.arguments[1];
          if (ts.isArrowFunction(fn)) {
            // Second arg is the test group function
            parseChildren(fn.body, parentTags);
          } else {
            throw new Error('Unexpected second argument');
          }

        } else if (ts.isArrayLiteralExpression(firstArg)) {
          // First arg is tags list

          const fn = node.expression.arguments[2];
          if (ts.isArrowFunction(fn)) {
            // Third arg is the test group function
            const newTags = firstArg.elements.map((element: any) => element.text);
            const tags = [...parentTags, ...newTags];
            parseChildren(fn.body, tags);
          } else {
            throw new Error('Unexpected third argument');
          }

        } else {
          throw new Error('Unexpected first argument');
        }

      } else if (isIt(node)) {
        if (ts.isStringLiteral(firstArg)) {
          // First arg is title

          if (parentTags.length) {
            // Create a new node with parent tag list as the first argument
            const transformerFactory = () => {
              return (rootNode: ts.ExpressionStatement) => {
                const elements = parentTags.map((tag) => factory.createStringLiteral(tag));
                const tagsArg = factory.createArrayLiteralExpression(elements, false);

                if (ts.isCallExpression(rootNode.expression)) {
                  const newArgs: ts.NodeArray<ts.Expression> = factory.createNodeArray([tagsArg, ...rootNode.expression.arguments]);
                  const newExpression = factory.createCallExpression(rootNode.expression.expression, undefined, newArgs);
                  const newExpressionStatement = factory.createExpressionStatement(newExpression);
                  return newExpressionStatement;
                } else {
                  return rootNode;
                }
              }
            }

            ts.transform(node, [transformerFactory]);
          }

        } else if (ts.isArrayLiteralExpression(firstArg)) {
          // First arg is tags list

          if (parentTags.length) {
            // Create a new node with combined tag lists as the first argument
            const transformerFactory = () => {
              return (rootNode: ts.ExpressionStatement) => {
                const nodeTags = firstArg.elements.map((element: any) => element.text);
                const uniqueTags = [...new Set([...nodeTags, ...parentTags])];
                const elements = uniqueTags.map((tag) => factory.createStringLiteral(tag));
                const tagsArg = factory.createArrayLiteralExpression(elements, false);

                if (ts.isCallExpression(rootNode.expression)) {
                  const newArgs: ts.NodeArray<ts.Expression> = factory.createNodeArray([tagsArg, ...rootNode.expression.arguments]);
                  const newExpression = factory.createCallExpression(rootNode.expression.expression, undefined, newArgs);
                  const newExpressionStatement = factory.createExpressionStatement(newExpression);
                  return newExpressionStatement;
                } else {
                  return rootNode;
                }
              }
            }

            ts.transform(node, [transformerFactory]);
          }

        } else {
          throw new Error('Unexpected first argument');
        }

      }
    }
  });
};

const process = (fileName: string, source: string) => {
  const nodes = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest);
  parseChildren(nodes, []);

  const printer = ts.createPrinter();
  const result = printer.printNode(ts.EmitHint.Unspecified, nodes, nodes);

  return result;
};

const transform = (fileName: string) => {
  let data = '';

  function ondata (d: through.ThroughStream) {
    data += d;
  }

  function onend (this: through.ThroughStream) {
    this.queue(process(fileName, data));
    this.emit('end');
  }

  return through(ondata, onend);
};

const onFilePreprocessor = () => {
  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript'),
    browserifyOptions: {
      ...browserify.defaultOptions.browserifyOptions,
      extensions: ['.ts'],
      transform: [
        ...browserify.defaultOptions.browserifyOptions.transform,
        (fileName: string) => transform(fileName),
      ],
    },
  };

  return browserify(options);
};

module.exports = onFilePreprocessor;
