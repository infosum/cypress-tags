/// <reference path="../types/index.d.ts" />

import through from 'through';
import ts, { factory } from 'typescript';

import browserify from '@cypress/browserify-preprocessor';

const isTestBlock = (name: string) => (node: ts.CallExpression | ts.PropertyAccessExpression) => {
  return ts.isIdentifier(node.expression) &&
    node.expression.escapedText === name;
};

const isPropertyAccessExpression = (name: string) => (node: ts.PropertyAccessExpression) => {
  return node.name.escapedText === name;
};

const isTitle = (node: ts.Expression) => {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node));
};

const isDescribe = isTestBlock('describe');
const isXDescribe = isTestBlock('xdescribe');
const isContext = isTestBlock('context');
const isIt = isTestBlock('it');
const isXIt = isTestBlock('xit');

const isOnly = isPropertyAccessExpression('only');
const isSkip = isPropertyAccessExpression('skip');

// Convert tags from comma delimitered environment variables to string arrays
const extractTags = (config: Cypress.PluginConfigOptions) => {
  const includeEnvVar = config.env.CYPRESS_INCLUDE_TAGS ?? process.env.CYPRESS_INCLUDE_TAGS;
  const excludeEnvVar = config.env.CYPRESS_EXCLUDE_TAGS ?? process.env.CYPRESS_EXCLUDE_TAGS;
  const includeTags = includeEnvVar ? includeEnvVar.split(',') : [];
  const excludeTags = excludeEnvVar ? excludeEnvVar.split(',') : [];

  return {
    includeTags,
    excludeTags,
  };
};

interface EnvVars {
  includeUseBooleanAnd: boolean;
  excludeUseBooleanAnd: boolean;
}

// Convert tags from comma delimitered environment variables to string arrays
const extractEnvVars = (config: Cypress.PluginConfigOptions): EnvVars => {
  const includeUseBooleanAnd = config.env.CYPRESS_INCLUDE_USE_BOOLEAN_AND ?? process.env.CYPRESS_INCLUDE_USE_BOOLEAN_AND;
  const excludeUseBooleanAnd = config.env.CYPRESS_EXCLUDE_USE_BOOLEAN_AND ?? process.env.CYPRESS_EXCLUDE_USE_BOOLEAN_AND;

  return {
    includeUseBooleanAnd,
    excludeUseBooleanAnd,
  };
};

// Use include and exclude tags to determine if current node should be skipped
const calculateSkipChildren = (
  includeTags: string[],
  excludeTags: string[],
  tags: string[],
  isDescribeNode: boolean,
  envVars: EnvVars
): boolean => {
  // Don't perform include test on describe nodes, allow the result to fall through into inner nodes
  const includeTest = isDescribeNode || includeTags.length === 0
    || (envVars.includeUseBooleanAnd
      ? includeTags.every(tag => tags.includes(tag))
      : tags.some(tag => includeTags.includes(tag))
    );
  const excludeTest = excludeTags.length > 0
    && (envVars.excludeUseBooleanAnd
      ? excludeTags.every(tag => tags.includes(tag))
      : tags.some(tag => excludeTags.includes(tag))
    );

  return !(includeTest && !excludeTest);
}

// Remove tag argument from node. Return new node, tags list, and whether or not to skip node
const removeTagsFromNode = (
  node: ts.Node,
  parentTags: string[],
  includeTags: string[],
  excludeTags: string[],
  isDescribeNode: boolean,
  envVars: EnvVars
): {
  node: ts.Node,
  tags: string[],
  skipNode: boolean,
} => {
  if (!ts.isCallExpression(node)) {
    return {
      node,
      tags: parentTags,
      skipNode: false,
    };
  }

  const firstArg = node.arguments[0];
  let nodeTags: string[] = [];

  // Extract tags from node
  if (ts.isArrayLiteralExpression(firstArg)) {
    nodeTags = firstArg.elements.map((element) => {
      if (ts.isStringLiteral(element)) {
        return element.text;
      } else if (ts.isPropertyAccessExpression(element)) {
        // Return enum's string value, eg. Tag.WIP => "WIP"
        return element.name.escapedText as string;
      }
      return '';
    }).filter((tag) => tag !== '');
  } else if (ts.isStringLiteral(firstArg)) {
    nodeTags = [firstArg.text];
  } else {
    return {
      node,
      tags: parentTags,
      skipNode: false,
    };
  }

  // Create unique list of tags from current node and parents
  const uniqueTags = [...new Set([...nodeTags, ...parentTags])];
  const skipNode = calculateSkipChildren(includeTags, excludeTags, uniqueTags, isDescribeNode, envVars);

  // Create a new node removing the tag list as the first argument
  const newArgs: ts.NodeArray<ts.Expression> = factory.createNodeArray([...node.arguments.slice(1)]);
  const newExpression = factory.createCallExpression(node.expression, undefined, newArgs);

  return {
    node: newExpression,
    tags: uniqueTags,
    skipNode,
  };
}

// Transform TypeScript AST to filter tests and remove tag arguments to make compatible with Cypress types
const transformer = (config: Cypress.PluginConfigOptions) => <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
  const { includeTags, excludeTags } = extractTags(config);
  const envVars = extractEnvVars(config);

  const visit = (node: ts.Node, parentTags?: string[]): ts.Node | undefined => {
    let tags: string[] = parentTags ?? [];
    let returnNode = node;

    let skipNode = false;

    if (ts.isCallExpression(node)) {
      const firstArg = node.arguments[0];
      const secondArg = node.arguments[1];

      const firstArgIsTag = firstArg && ts.isStringLiteral(firstArg) && isTitle(secondArg);

      // Check block for tags and skip nodes as required
      const checkBlockForTags = (nodeExpression: ts.CallExpression | ts.PropertyAccessExpression, node: ts.CallExpression) => {
        if (isDescribe(nodeExpression) || isContext(nodeExpression) || isXDescribe(nodeExpression)) {
          // Describe / Context block
          if (firstArgIsTag || ts.isArrayLiteralExpression(firstArg)) {
            // First arg is single tag or tags list
            const result = removeTagsFromNode(node, tags, includeTags, excludeTags, true, envVars);
            skipNode = result.skipNode;
            returnNode = result.node;
            tags = result.tags;
          }
        } else if (isIt(nodeExpression) || isXIt(nodeExpression)) {
          // It block
          if (firstArgIsTag || ts.isArrayLiteralExpression(firstArg)) {
            // First arg is single tag or tags list
            const result = removeTagsFromNode(node, tags, includeTags, excludeTags, false, envVars);
            skipNode = result.skipNode;
            returnNode = result.node;
          } else if (isTitle(firstArg)) {
            // First arg is title
            skipNode = calculateSkipChildren(includeTags, excludeTags, tags, false, envVars);
          }
        }
      };

      if (ts.isIdentifier(node.expression)) {
        checkBlockForTags(node, node);
      } else if (ts.isPropertyAccessExpression(node.expression)) {
        // Extra check in case property access expression is from a forEach or similar
        if (isSkip(node.expression) || isOnly(node.expression)) {
          // Node contains a .skip or .only
          checkBlockForTags(node.expression, node);
        }
      }
    }

    if (skipNode) {
      // Replaces node with semi-colon, effectively skipping node and any children
      returnNode = factory.createEmptyStatement();
    } else {
      returnNode = ts.visitEachChild(returnNode, (node) => visit(node, tags), context);
    }

    return returnNode;
  };

  return ts.visitNode(rootNode, visit);
};

const processFile = (fileName: string, source: string, config: Cypress.PluginConfigOptions) => {
  const printer = ts.createPrinter();

  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const transformedResult = ts.transform<ts.SourceFile>(sourceFile, [transformer(config)]);
  const transformedSourceFile: ts.SourceFile = transformedResult.transformed[0];
  const result = printer.printFile(transformedSourceFile);

  return result;
};

const transform = (fileName: string, config: Cypress.PluginConfigOptions) => {
  let data = '';

  function ondata(d: through.ThroughStream) {
    data += d;
  }

  function onend(this: through.ThroughStream) {
    this.queue(processFile(fileName, data, config));
    this.emit('end');
  }

  if (/\.json$/.test(fileName)) {
    return through();
  }

  return through(ondata, onend);
};

const preprocessor = (config: Cypress.PluginConfigOptions) => {
  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript'),
    browserifyOptions: {
      ...browserify.defaultOptions.browserifyOptions,
      extensions: ['.ts'],
      transform: [
        ...browserify.defaultOptions.browserifyOptions.transform,
        (fileName: string) => transform(fileName, config),
      ],
    },
  };

  return browserify(options);
};

preprocessor.transform = transform;

module.exports = preprocessor;
