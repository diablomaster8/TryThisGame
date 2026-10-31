/**
 * Project-local ESLint rules (TECH-48, TECH-40). Kept in-repo instead of adding a plugin
 * package: each is a few lines over the AST and needs no install.
 */

/** `import/first`: every import declaration sits above the first other statement. */
const importFirst = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Imports come before any other statement.' },
    schema: [],
    messages: { first: 'Move this import above the code: imports belong at the top of the file.' },
  },
  create(context) {
    return {
      Program(node) {
        let seenCode = false;
        for (const stmt of node.body) {
          if (stmt.type === 'ImportDeclaration') {
            if (seenCode) context.report({ node: stmt, messageId: 'first' });
          } else if (!(stmt.type === 'ExpressionStatement' && stmt.directive)) {
            seenCode = true;
          }
        }
      },
    };
  },
};

export default { rules: { 'import-first': importFirst } };
