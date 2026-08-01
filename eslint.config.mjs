import tsParser from '@typescript-eslint/parser';

const importBoundaryPlugin = {
  rules: {
    'no-forbidden-imports': {
      create(context) {
        const filename = context.filename || context.getFilename?.() || '';

        return {
          ImportDeclaration(node) {
            const importPath = node.source.value;

            // Rule 1: web client components or client code cannot import @transport-platform/supabase/admin directly
            // Only apps/web/src/lib/supabase/admin.ts or server contexts may import /admin
            if (
              (filename.includes('apps/web/src/app') || filename.includes('apps/driver')) &&
              importPath === '@transport-platform/supabase/admin'
            ) {
              context.report({
                node,
                message: `Architectural Violation: Client components and mobile apps cannot import "@transport-platform/supabase/admin". Use server-only adapters.`,
              });
            }

            // Rule 2: Driver app cannot import /admin
            if (filename.includes('apps/driver') && importPath.includes('supabase/admin')) {
              context.report({
                node,
                message: `Architectural Violation: Driver mobile app is strictly forbidden from importing Supabase admin clients.`,
              });
            }

            // Rule 3: Packages cannot import apps
            if (filename.includes('packages/') && (importPath.startsWith('apps/') || importPath.includes('/apps/'))) {
              context.report({
                node,
                message: `Architectural Violation: Shared packages cannot import application code from "apps/".`,
              });
            }

            // Rule 4: design-tokens cannot import UI packages or apps
            if (filename.includes('packages/design-tokens') && importPath.includes('/ui-')) {
              context.report({
                node,
                message: `Architectural Violation: "@transport-platform/design-tokens" cannot import UI component packages.`,
              });
            }
          },
        };
      },
    },
  },
};

export default [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/.expo/**', '**/dist/**', '**/build/**', '**/.turbo/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      boundaries: importBoundaryPlugin,
    },
    rules: {
      'boundaries/no-forbidden-imports': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
