import { Box, Button, Grid, LinearProgress, TextField } from '@mui/material';
import React from 'react';
import { H2 } from '../common/Heading';
import { SearchResultBox } from './SearchResultBox';
import type { AudioFileNodeQueryInput } from '../../../graphql/graphql';
import { useSearchAudioFileNodeQuery } from '../../../graphql/graphql';

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

export const AudioSearch: React.FC = () => {
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

  console.log(query);

  return (
    <Box>
      <Grid container>
        <Grid item xs={10}>
          <H2>オーディオファイルを検索</H2>
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

      <Grid container spacing={2}>
        {fields.map(({ name, label, hasMany }) => (
          <Grid item xs={6} key={label} sx={{ my: 1 }}>
            <TextField
              id={name}
              label={label}
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
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
          </Grid>
        ))}
      </Grid>

      <H2>検索結果</H2>

      {loading && <LinearProgress />}
      {error != null && <p>Error: {error.message}</p>}
      {data?.audioFileNodes.map((node) => {
        return (
          <SearchResultBox
            key={node.id}
            sx={{ my: 2, p: 1, textAlign: 'left' }}
            node={node}
          />
        );
      })}
    </Box>
  );
};
