'use client';

import styled from '@emotion/styled';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  LinearProgress,
  TextField,
} from '@mui/material';
import React from 'react';
import { H1 } from '@/app/_components/common/H1';
import type { AudioFileNodeQueryInput } from '@/graphql/graphql';
import { useSearchAudioFileNodeQuery } from '@/graphql/graphql';

type Field =
  | {
      name: 'album' | 'albumArtist' | 'fileName' | 'filePath' | 'title';
      label: string;
      hasMany: false;
    }
  | {
      name: 'artists' | 'tags' | 'tracks';
      label: string;
      hasMany: true;
    };

const fields: Field[] = [
  {
    name: 'filePath',
    label: 'ファイルパス',
    hasMany: false,
  },
  {
    name: 'fileName',
    label: 'ファイル名',
    hasMany: false,
  },
  {
    name: 'artists',
    label: 'アーティスト',
    hasMany: true,
  },
  {
    name: 'album',
    label: 'アルバム',
    hasMany: false,
  },
  {
    name: 'tracks',
    label: 'トラック',
    hasMany: true,
  },
  {
    name: 'title',
    label: 'タイトル',
    hasMany: false,
  },
  {
    name: 'albumArtist',
    label: 'アルバムアーティスト',
    hasMany: false,
  },
  {
    name: 'tags',
    label: 'タグ (ジャンルなど)',
    hasMany: true,
  },
];

export const SearchForm: React.FC = () => {
  const [query, setQuery] = React.useState<AudioFileNodeQueryInput>({});
  const { data, loading, error } = useSearchAudioFileNodeQuery({
    skip: Object.keys(query).length === 0,
    variables: {
      and: query,
      or: {},
      limit: 10,
      offset: 0,
    },
    context: {
      debounceKey: 'searchAudioFileNode',
    },
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const copyToClipboard = async (v: string) => {
    await global.navigator.clipboard.writeText(v);
  };

  console.log(query);

  return (
    <Box>
      <Grid container>
        <Grid item xs={10}>
          <H1>オーディオファイルを検索</H1>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'right' }}>
          <Button
            variant="text"
            onClick={() => {
              setQuery({});
            }}
          >
            リセット
          </Button>
        </Grid>
      </Grid>

      {fields.map(({ name, label, hasMany }) => (
        <Box
          key={label}
          sx={{
            my: 2,
          }}
        >
          <TextField
            id={name}
            label={label}
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              // 空文字で検索かけちゃうので null にする
              const value =
                event.target.value === '' ? null : event.target.value;

              if (hasMany) {
                setQuery((prev) => {
                  if (value === null) {
                    return { ...prev, [name]: [] };
                  }

                  return { ...prev, [name]: [value] };
                });
              } else {
                setQuery((prev) => ({ ...prev, [name]: value }));
              }
            }}
          />
        </Box>
      ))}

      <H1>検索結果</H1>

      {loading && <LinearProgress />}
      {error && <p>Error: {error.message}</p>}
      {data &&
        data.audioFileNodes.map((node) => {
          return (
            <Card key={node.id} sx={{ my: 2, p: 1 }}>
              <ResultRowBox>
                ファイル:{' '}
                {node.filePath && (
                  <ResultChip
                    icon={<ContentCopyIcon />}
                    label={node.fileName}
                    onClick={() => {
                      copyToClipboard(node.filePath);
                    }}
                  />
                )}
              </ResultRowBox>
              <ResultRowBox>
                タイトル:{' '}
                {node.title && (
                  <ResultChip
                    icon={<ContentCopyIcon />}
                    label={node.title}
                    onClick={() => {
                      copyToClipboard(node.title);
                    }}
                  />
                )}
              </ResultRowBox>
              <ResultRowBox>
                アーティスト:{' '}
                {node.artists.map((artist, i) => (
                  <ResultChip
                    key={i}
                    icon={<ContentCopyIcon />}
                    label={artist}
                    onClick={() => {
                      copyToClipboard(artist);
                    }}
                  />
                ))}
              </ResultRowBox>
              <ResultRowBox>
                トラック:
                {node.containedTracks.map((track, i) => (
                  <ResultChip
                    key={i}
                    icon={<ContentCopyIcon />}
                    label={track}
                    onClick={() => {
                      copyToClipboard(track);
                    }}
                  />
                ))}
              </ResultRowBox>
              <ResultRowBox>
                アルバム:
                {node.album && (
                  <ResultChip
                    icon={<ContentCopyIcon />}
                    label={node.album}
                    onClick={() => {
                      copyToClipboard(node.album);
                    }}
                  />
                )}
              </ResultRowBox>
              <ResultRowBox>
                アルバムアーティスト:
                {node.albumArtist && (
                  <ResultChip
                    icon={<ContentCopyIcon />}
                    label={node.albumArtist}
                    onClick={() => {
                      copyToClipboard(node.albumArtist);
                    }}
                  />
                )}
              </ResultRowBox>
              <ResultRowBox>
                タグ:
                {node.tags.map((tag, i) => (
                  <ResultChip
                    key={i}
                    icon={<ContentCopyIcon />}
                    label={tag}
                    onClick={() => {
                      copyToClipboard(tag);
                    }}
                  />
                ))}
              </ResultRowBox>
            </Card>
          );
        })}
    </Box>
  );
};

const ResultRowBox = styled(Box)(() => ({
  marginTop: '1rem',
  marginBottom: '1rem',
}));

const ResultChip = styled(Chip)(() => ({
  marginRight: '0.5rem',
  marginLeft: '0.5rem',
  paddingRight: '0.5rem',
  paddingLeft: '0.5rem',
}));
