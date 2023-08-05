import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  hooks: {
    afterAllFileWrite: ['eslint --fix', 'prettier --write'],
  },
  schema: 'http://localhost:8080/v1/graphql',
  documents: 'app/**/*.gql',
  generates: {
    'graphql/': {
      preset: 'client',
      presetConfig: {
        extension: '.ts',
        baseTypesPath: './graphql.schema.json',
      },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        namingConvention: {
          typeNames: 'change-case#pascalCase',
          transformUnderscore: true,
        },
        skipTypename: false,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
          defaultValue: true,
        },
      },
      plugins: ['typescript-react-apollo'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
