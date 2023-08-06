import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client';
import DebounceLink from 'apollo-link-debounce';

export const getAudioCoverArt = async (filePath: string) => {
  const client = new ApolloClient({
    uri: 'http://localhost:8080/v1/graphql',
    headers: {},
    link: ApolloLink.from([
      new DebounceLink(300),
      new HttpLink({ uri: 'http://localhost:8080/v1/graphql' }),
    ]),
    ssrMode: false,
    cache: new InMemoryCache(),
  });

  const query = gql`
    query GetAudioCoverArt($filePath: String!) {
      audioCoverArt(filePath: $filePath) {
        __typename
        ... on AudioCoverArtSuccess {
          base64Img
        }
        ... on AudioCoverArtErrorFileDoesNotExist {
          code
          message
        }
        ... on AudioCoverArtErrorDoesNotHaveCover {
          code
          message
        }
      }
    }
  `;
  const variables = { filePath };

  const resp = await client.query({ query, variables });
  if (resp.errors) {
    throw Error(resp.errors[0].message);
  }

  switch (resp.data.audioCoverArt.__typename) {
    case 'AudioCoverArtSuccess':
      return resp.data.audioCoverArt.base64Img as string;
    case 'AudioCoverArtErrorFileDoesNotExist':
      throw Error(resp.data.audioCoverArt.message);
    case 'AudioCoverArtErrorDoesNotHaveCover':
      throw Error(resp.data.audioCoverArt.message);
    default:
      throw Error('Unknown error');
  }
};
