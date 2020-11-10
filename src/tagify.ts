import through from 'through';
import ts, { factory } from 'typescript';

const browserify = require('@cypress/browserify-preprocessor');

const isTestBlock = (name: string) => (node: ts.Node) => {
  return ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.escapedText === name;
};

const isDescribe = isTestBlock('describe');
const isContext = isTestBlock('context');
const isIt = isTestBlock('it');

const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
  const visit = (node: ts.Node, parentTags?: string[]): ts.Node => {

    let tags: string[] = parentTags ?? [];
    let returnNode = node;

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const firstArg = node.arguments[0];
      // console.log(ts.SyntaxKind[firstArg.kind]);
      // console.log(ts.isArrayLiteralExpression(firstArg));

      if (isDescribe(node) || isContext(node)) {
        if (ts.isArrayLiteralExpression(firstArg)) {
          // First arg is tags list
          const newTags = firstArg.elements.map((element: any) => element.text);
          tags = [...(parentTags ?? []), ...newTags];
        }
      } else if (isIt(node)) {
        if (ts.isStringLiteral(firstArg)) {
          // First arg is title
          if (parentTags?.length) {
            // Create a new node with parent tag list as the first argument
            const elements = parentTags.map((tag) => factory.createStringLiteral(tag, true));
            const tagsArg = factory.createArrayLiteralExpression(elements, false);

            const newArgs: ts.NodeArray<ts.Expression> = factory.createNodeArray([tagsArg, ...node.arguments]);
            const newExpression = factory.createCallExpression(node.expression, undefined, newArgs);
            ts.setSourceMapRange(newExpression, ts.getSourceMapRange(node))
            returnNode = newExpression;
          }
        } else if (ts.isArrayLiteralExpression(firstArg)) {
          // First arg is tags list
          if (parentTags?.length) {
            // Create a new node with combined tag lists as the first argument
            const nodeTags = firstArg.elements.map((element: any) => element.text);
            const uniqueTags = [...new Set([...nodeTags, ...parentTags])];
            const elements = uniqueTags.map((tag) => factory.createStringLiteral(tag, true));
            const tagsArg = factory.createArrayLiteralExpression(elements, false);

            const newArgs: ts.NodeArray<ts.Expression> = factory.createNodeArray([tagsArg, ...node.arguments.slice(1)]);
            const newExpression = factory.createCallExpression(node.expression, undefined, newArgs);
            returnNode = newExpression;
          }
        }
      }
    }

    returnNode = ts.visitEachChild(returnNode, (node) => visit(node, tags), context);

    return returnNode;
  };
  return ts.visitNode(rootNode, visit);
};

const process = (fileName: string, source: string) => {
  const printer = ts.createPrinter();

  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const transformedResult = ts.transform<ts.SourceFile>(sourceFile, [transformer]);
  const transformedSourceFile: ts.SourceFile = transformedResult.transformed[0];
  const result = printer.printFile(transformedSourceFile);

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

module.exports = {
  onFilePreprocessor,
  transform,
};
