/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AudioFileNode = {
  __typename?: 'AudioFileNode';
  album: Scalars['String']['output'];
  albumArtist: Scalars['String']['output'];
  artists: Array<Scalars['String']['output']>;
  containedTracks: Array<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  filePath: Scalars['String']['output'];
  id: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type AudioFileNodeQueryInput = {
  album?: InputMaybe<Scalars['String']['input']>;
  albumArtist?: InputMaybe<Scalars['String']['input']>;
  artists?: InputMaybe<Array<Scalars['String']['input']>>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  tracks?: InputMaybe<Array<Scalars['String']['input']>>;
};

/**
 * エラーを表す共通の interface。
 * エラーを表す type はすべてこの interface を実装する。
 */
export type Error = {
  /** エラーの種別を端的に表すフィールド。HTTPステータスのテキストを使う */
  code: Scalars['String']['output'];
  /** エラーの概要を表すフィールド。ユーザに見せて良い */
  message: Scalars['String']['output'];
};

/** input のフィールドレベルでエラーの詳細を記述する */
export type ErrorDetail = {
  __typename?: 'ErrorDetail';
  /** エラーが起きた原因となった input のフィールド名 */
  fieldName: Scalars['String']['output'];
  /** fieldName に対するエラーメッセージ。ユーザに見せて良い */
  message: Scalars['String']['output'];
};

/** inputが配列だった場合にフィールドレベルでエラーの詳細を記述するために使う */
export type ErrorDetailWithIndex = {
  __typename?: 'ErrorDetailWithIndex';
  /** エラーが起きた原因となった input のフィールド名 */
  fieldName: Scalars['String']['output'];
  /** もとのinputの要素の何番目でエラーが起きたか */
  index: Scalars['Int']['output'];
  /** fieldName に対するエラーメッセージ。ユーザに見せて良い */
  message: Scalars['String']['output'];
};

/**
 * Authorization に含まれている JWT から Payload を抜き出せなかったときのエラー。
 * 基本的にHasura や API Gateway で JWT のバリデーションがされるので通常運用では起こり得ない
 */
export type ErrorUnauthorized = Error & {
  __typename?: 'ErrorUnauthorized';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  health: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  audioFileNodes: Array<AudioFileNode>;
  health: Scalars['String']['output'];
};

export type QueryAudioFileNodesArgs = {
  and: InputMaybe<AudioFileNodeQueryInput>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  or: InputMaybe<AudioFileNodeQueryInput>;
};

/**
 * query/mutation の返り値の Result 型はすべてこの interface を実装する。
 * ok: true の場合、処理成功のモデル、ok: false の場合はエラーのモデルを返す
 */
export type ResultBase = {
  ok: Scalars['Boolean']['output'];
};

export type SearchAudioFileNodeQueryVariables = Exact<{
  and: InputMaybe<AudioFileNodeQueryInput>;
  or: InputMaybe<AudioFileNodeQueryInput>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
}>;

export type SearchAudioFileNodeQuery = {
  __typename?: 'Query';
  audioFileNodes: Array<{
    __typename?: 'AudioFileNode';
    id: string;
    filePath: string;
    fileName: string;
    album: string;
    albumArtist: string;
    artists: Array<string>;
    containedTracks: Array<string>;
  }>;
};

export const SearchAudioFileNodeDocument = gql`
  query SearchAudioFileNode(
    $and: AudioFileNodeQueryInput
    $or: AudioFileNodeQueryInput
    $limit: Int
    $offset: Int
  ) {
    audioFileNodes(and: $and, or: $or, limit: $limit, offset: $offset) {
      id
      filePath
      fileName
      album
      albumArtist
      artists
      containedTracks
    }
  }
`;

/**
 * __useSearchAudioFileNodeQuery__
 *
 * To run a query within a React component, call `useSearchAudioFileNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAudioFileNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAudioFileNodeQuery({
 *   variables: {
 *      and: // value for 'and'
 *      or: // value for 'or'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useSearchAudioFileNodeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SearchAudioFileNodeQuery,
    SearchAudioFileNodeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchAudioFileNodeQuery,
    SearchAudioFileNodeQueryVariables
  >(SearchAudioFileNodeDocument, options);
}
export function useSearchAudioFileNodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchAudioFileNodeQuery,
    SearchAudioFileNodeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchAudioFileNodeQuery,
    SearchAudioFileNodeQueryVariables
  >(SearchAudioFileNodeDocument, options);
}
export type SearchAudioFileNodeQueryHookResult = ReturnType<
  typeof useSearchAudioFileNodeQuery
>;
export type SearchAudioFileNodeLazyQueryHookResult = ReturnType<
  typeof useSearchAudioFileNodeLazyQuery
>;
export type SearchAudioFileNodeQueryResult = Apollo.QueryResult<
  SearchAudioFileNodeQuery,
  SearchAudioFileNodeQueryVariables
>;
