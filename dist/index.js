"use strict";
/// <reference path="../types/index.d.ts" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagify = exports.transform = void 0;
const boolean_parser_1 = __importDefault(require("boolean-parser"));
const through_1 = __importDefault(require("through"));
const typescript_1 = __importStar(require("typescript"));
const browserify_preprocessor_1 = __importDefault(require("@cypress/browserify-preprocessor"));
const isTestBlock = (name) => (node) => {
    return typescript_1.default.isIdentifier(node.expression) &&
        node.expression.escapedText === name;
};
const isPropertyAccessExpression = (name) => (node) => {
    return node.name.escapedText === name;
};
const isTitle = (node) => {
    return node && (typescript_1.default.isStringLiteral(node) || typescript_1.default.isNoSubstitutionTemplateLiteral(node) || typescript_1.default.isTemplateExpression(node));
};
const isDescribe = isTestBlock('describe');
const isXDescribe = isTestBlock('xdescribe');
const isContext = isTestBlock('context');
const isIt = isTestBlock('it');
const isXIt = isTestBlock('xit');
const isOnly = isPropertyAccessExpression('only');
const isSkip = isPropertyAccessExpression('skip');
// Convert tags from comma delimitered environment variables to string arrays
const extractTags = (config) => {
    var _a, _b;
    const includeEnvVar = (_a = config.env.CYPRESS_INCLUDE_TAGS) !== null && _a !== void 0 ? _a : process.env.CYPRESS_INCLUDE_TAGS;
    const excludeEnvVar = (_b = config.env.CYPRESS_EXCLUDE_TAGS) !== null && _b !== void 0 ? _b : process.env.CYPRESS_EXCLUDE_TAGS;
    const includeTags = includeEnvVar ? includeEnvVar.split(',') : [];
    const excludeTags = excludeEnvVar ? excludeEnvVar.split(',') : [];
    return {
        includeTags,
        excludeTags,
    };
};
const extractExpressionTags = (config) => {
    var _a, _b;
    const includeExpression = (_a = config.env.CYPRESS_INCLUDE_EXPRESSION) !== null && _a !== void 0 ? _a : process.env.CYPRESS_INCLUDE_EXPRESSION;
    const excludeExpression = (_b = config.env.CYPRESS_EXCLUDE_EXPRESSION) !== null && _b !== void 0 ? _b : process.env.CYPRESS_EXCLUDE_EXPRESSION;
    const parsedIncludeTagsSet = includeExpression ? boolean_parser_1.default.parseBooleanQuery(includeExpression) : [];
    const parsedExcludeTagsSet = excludeExpression ? boolean_parser_1.default.parseBooleanQuery(excludeExpression) : [];
    return {
        parsedIncludeTagsSet,
        parsedExcludeTagsSet
    };
};
// Convert tags from comma delimitered environment variables to string arrays
const extractEnvVars = (config) => {
    var _a, _b, _c;
    const includeUseBooleanAnd = (_a = config.env.CYPRESS_INCLUDE_USE_BOOLEAN_AND) !== null && _a !== void 0 ? _a : process.env.CYPRESS_INCLUDE_USE_BOOLEAN_AND;
    const excludeUseBooleanAnd = (_b = config.env.CYPRESS_EXCLUDE_USE_BOOLEAN_AND) !== null && _b !== void 0 ? _b : process.env.CYPRESS_EXCLUDE_USE_BOOLEAN_AND;
    const useIncludeExcludeExpressions = (_c = config.env.CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS) !== null && _c !== void 0 ? _c : process.env.CYPRESS_USE_INCLUDE_EXCLUDE_EXPRESSIONS;
    return {
        includeUseBooleanAnd,
        excludeUseBooleanAnd,
        useIncludeExcludeExpressions
    };
};
const calculateParsedTagSetMatch = (parsedExpressionTagSet, tags, includeOrExclude) => {
    if (parsedExpressionTagSet.length == 0) {
        return includeOrExclude === 'include';
    }
    for (let expressionTags of parsedExpressionTagSet) {
        if (expressionTags.every(tag => tags.includes(tag))) {
            return true;
        }
    }
    return false;
};
// Use include and exclude tags to determine if current node should be skipped
const calculateSkipChildren = (includeTags, excludeTags, parsedIncludeTagsSet, parsedExcludeTagsSet, tags, isDescribeNode, envVars) => {
    // Don't perform include test on describe nodes, allow the result to fall through into inner nodes
    const includeTest = envVars.useIncludeExcludeExpressions
        ? isDescribeNode || calculateParsedTagSetMatch(parsedIncludeTagsSet, tags, 'include')
        : isDescribeNode || includeTags.length === 0 || (envVars.includeUseBooleanAnd
            ? includeTags.every(tag => tags.includes(tag))
            : tags.some(tag => includeTags.includes(tag)));
    const excludeTest = envVars.useIncludeExcludeExpressions
        ? calculateParsedTagSetMatch(parsedExcludeTagsSet, tags, 'exclude')
        : excludeTags.length > 0 && (envVars.excludeUseBooleanAnd
            ? excludeTags.every(tag => tags.includes(tag))
            : tags.some(tag => excludeTags.includes(tag)));
    return !(includeTest && !excludeTest);
};
// Remove tag argument from node. Return new node, tags list, and whether or not to skip node
const removeTagsFromNode = (node, parentTags, includeTags, excludeTags, parsedIncludeTagsSet, parsedExcludeTagsSet, isDescribeNode, envVars) => {
    if (!typescript_1.default.isCallExpression(node)) {
        return {
            node,
            tags: parentTags,
            skipNode: false,
        };
    }
    const firstArg = node.arguments[0];
    let nodeTags = [];
    // Extract tags from node
    if (typescript_1.default.isArrayLiteralExpression(firstArg)) {
        nodeTags = firstArg.elements.map((element) => {
            if (typescript_1.default.isStringLiteral(element)) {
                return element.text;
            }
            else if (typescript_1.default.isPropertyAccessExpression(element)) {
                // Return enum's string value, eg. Tag.WIP => "WIP"
                return element.name.escapedText;
            }
            return '';
        }).filter((tag) => tag !== '');
    }
    else if (typescript_1.default.isStringLiteral(firstArg)) {
        nodeTags = [firstArg.text];
    }
    else {
        return {
            node,
            tags: parentTags,
            skipNode: false,
        };
    }
    // Create unique list of tags from current node and parents
    const uniqueTags = [...new Set([...nodeTags, ...parentTags])];
    const skipNode = calculateSkipChildren(includeTags, excludeTags, parsedIncludeTagsSet, parsedExcludeTagsSet, uniqueTags, isDescribeNode, envVars);
    // Create a new node removing the tag list as the first argument
    const newArgs = typescript_1.factory.createNodeArray([...node.arguments.slice(1)]);
    const newExpression = typescript_1.factory.createCallExpression(node.expression, undefined, newArgs);
    return {
        node: newExpression,
        tags: uniqueTags,
        skipNode,
    };
};
// Transform TypeScript AST to filter tests and remove tag arguments to make compatible with Cypress types
const transformer = (config) => (context) => (rootNode) => {
    const { includeTags, excludeTags } = extractTags(config);
    const { parsedIncludeTagsSet, parsedExcludeTagsSet } = extractExpressionTags(config);
    const envVars = extractEnvVars(config);
    const visit = (node, parentTags) => {
        let tags = parentTags !== null && parentTags !== void 0 ? parentTags : [];
        let returnNode = node;
        let skipNode = false;
        if (typescript_1.default.isCallExpression(node)) {
            const firstArg = node.arguments[0];
            const secondArg = node.arguments[1];
            const firstArgIsTag = firstArg && typescript_1.default.isStringLiteral(firstArg) && isTitle(secondArg);
            // Check block for tags and skip nodes as required
            const checkBlockForTags = (nodeExpression, node) => {
                if (isDescribe(nodeExpression) || isContext(nodeExpression) || isXDescribe(nodeExpression)) {
                    // Describe / Context block
                    if (firstArgIsTag || typescript_1.default.isArrayLiteralExpression(firstArg)) {
                        // First arg is single tag or tags list
                        const result = removeTagsFromNode(node, tags, includeTags, excludeTags, parsedIncludeTagsSet, parsedExcludeTagsSet, true, envVars);
                        skipNode = result.skipNode;
                        returnNode = result.node;
                        tags = result.tags;
                    }
                }
                else if (isIt(nodeExpression) || isXIt(nodeExpression)) {
                    // It block
                    if (firstArgIsTag || typescript_1.default.isArrayLiteralExpression(firstArg)) {
                        // First arg is single tag or tags list
                        const result = removeTagsFromNode(node, tags, includeTags, excludeTags, parsedIncludeTagsSet, parsedExcludeTagsSet, false, envVars);
                        skipNode = result.skipNode;
                        returnNode = result.node;
                    }
                    else if (isTitle(firstArg)) {
                        // First arg is title
                        skipNode = calculateSkipChildren(includeTags, excludeTags, parsedIncludeTagsSet, parsedExcludeTagsSet, tags, false, envVars);
                    }
                }
            };
            if (typescript_1.default.isIdentifier(node.expression)) {
                checkBlockForTags(node, node);
            }
            else if (typescript_1.default.isPropertyAccessExpression(node.expression)) {
                // Extra check in case property access expression is from a forEach or similar
                if (isSkip(node.expression) || isOnly(node.expression)) {
                    // Node contains a .skip or .only
                    checkBlockForTags(node.expression, node);
                }
            }
        }
        if (skipNode) {
            // Replaces node with semi-colon, effectively skipping node and any children
            returnNode = typescript_1.factory.createOmittedExpression();
        }
        else {
            returnNode = typescript_1.default.visitEachChild(returnNode, (node) => visit(node, tags), context);
        }
        return returnNode;
    };
    return typescript_1.default.visitNode(rootNode, visit);
};
const processFile = (fileName, source, config) => {
    const printer = typescript_1.default.createPrinter();
    const sourceFile = typescript_1.default.createSourceFile(fileName, source, typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
    const transformedResult = typescript_1.default.transform(sourceFile, [transformer(config)]);
    const transformedSourceFile = transformedResult.transformed[0];
    const result = printer.printFile(transformedSourceFile);
    return result;
};
const transform = (fileName, config) => {
    let data = '';
    function ondata(d) {
        data += d;
    }
    function onend() {
        this.queue(processFile(fileName, data, config));
        this.emit('end');
    }
    if (/\.json$/.test(fileName)) {
        return (0, through_1.default)();
    }
    return (0, through_1.default)(ondata, onend);
};
exports.transform = transform;
const preprocessor = (config) => {
    const options = Object.assign(Object.assign({}, browserify_preprocessor_1.default.defaultOptions), { typescript: require.resolve('typescript'), browserifyOptions: Object.assign(Object.assign({}, browserify_preprocessor_1.default.defaultOptions.browserifyOptions), { extensions: ['.ts'], transform: [
                ...browserify_preprocessor_1.default.defaultOptions.browserifyOptions.transform,
                (fileName) => (0, exports.transform)(fileName, config),
            ] }) });
    return (0, browserify_preprocessor_1.default)(options);
};
exports.tagify = preprocessor;
