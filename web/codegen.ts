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
      plugins: [
        'typescript-operations',
        'typescript-react-apollo',
        'typescript-document-nodes',
        'named-operations-object',
      ],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
