// (event, _, root) => {}みたいに使わない引数を除外するときに警告しないようにする
const noUnusedVarsRule = {
  argsIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_',
  destructuredArrayIgnorePattern: '^_',
  // Note { ref, ...others } = propsのように不要なrefの取り除くときに、unused-vars警告を無視できるが、refを使っているのかがわからなくなってしまうので使わない
  // 代わりに、varsIgnorePatternで、{ ref: _, ...others } = propsのように回避できるようにする
  // ignoreRestSiblings: true,
  varsIgnorePattern: '^_',
};

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:json/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        alphabetize: {
          order: 'asc',
        },
        warnOnUnassignedImports: true,
      },
    ],
    'import/newline-after-import': ['error'],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],
    'no-param-reassign': ['error'],
    'prefer-template': ['error'],
    'no-nested-ternary': ['error'],
    curly: ['error'],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'no-unused-vars': ['warn', noUnusedVarsRule],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', noUnusedVarsRule],
      },
    },
    // コンポーネントのFile名をPascalCaseに縛る
    {
      files: ['**/component/**/*.tsx', '**/provider/**/*.tsx'],
      plugins: ['unicorn'],
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              pascalCase: true,
            },
            ignore: [/\.stories\.tsx$/, /^theme\.tsx$/, /use.+\.tsx$/],
          },
        ],
      },
    },
    // フォーマット関連のESLintの無効を有効にするためにprettierは最後にoverrideする
    {
      files: ['*'],
      extends: ['prettier'],
    },
  ],
};
