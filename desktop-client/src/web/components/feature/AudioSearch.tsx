import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import React, { useMemo } from 'react';
import { H2 } from '../common/Heading';
import { SearchResultBox } from './SearchResultBox';
import type { AudioFileNodeQueryInput } from '../../../graphql/graphql';
import { useSearchAudioFileNodeQuery } from '../../../graphql/graphql';
import { DialogButton } from '../common/DialogButton';

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
  const [limit, setLimit] = React.useState(50);
  const [offset, setOffset] = React.useState(0);
  const [joinCond, setJoinCond] = React.useState<'AND' | 'OR'>('AND');
  const variables = useMemo(() => {
    return {
      and: joinCond === 'AND' ? query : {},
      or: joinCond === 'OR' ? query : {},
      limit: limit ?? 50,
      offset: offset ?? 0,
    };
  }, [query, limit, offset, joinCond]);
  const { data, loading, error } = useSearchAudioFileNodeQuery({
    skip: Object.keys(query).length === 0,
    variables,
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

  return (
    <Box>
      <Grid container>
        <Grid item xs={9}>
          <H2>オーディオファイルを検索</H2>
        </Grid>
        <Grid item xs={1.5} sx={{ textAlign: 'right' }}>
          <DialogButton buttonLabel="Variables" dialogTitle="Variables">
            <pre>{JSON.stringify(variables, null, 2)}</pre>
          </DialogButton>
        </Grid>
        <Grid item xs={1.5} sx={{ textAlign: 'right' }}>
          <Button
            variant="text"
            onClick={() => {
              setQuery({});
            }}
          >
            Reset
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

        <Grid item xs={6} sx={{ my: 1 }}>
          <TextField
            id={'limit'}
            label={'上限'}
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            onChange={(event) => {
              if (event.target.value === '') {
                setLimit(50);
              }

              const value = parseInt(event.target.value, 10);
              if (Number.isNaN(value)) {
                event.target.value = '';
                setLimit(50);
              }

              setLimit(value);
            }}
          />
        </Grid>

        <Grid item xs={6} sx={{ my: 1 }}>
          <TextField
            id={'offset'}
            label={'オフセット'}
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            onChange={(event) => {
              if (event.target.value === '') {
                setOffset(0);
              }

              const value = parseInt(event.target.value, 10);
              if (Number.isNaN(value)) {
                event.target.value = '';
                setOffset(0);
              }

              setOffset(value);
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ ml: 0.5 }}>
            <FormLabel>結合条件</FormLabel>
            <RadioGroup
              row
              name="row-radio-buttons-group"
              defaultValue={'AND'}
              value={joinCond}
              onChange={(event) => {
                if (
                  event.target.value === 'AND' ||
                  event.target.value === 'OR'
                ) {
                  setJoinCond(event.target.value);
                }
              }}
            >
              <FormControlLabel value="AND" control={<Radio />} label="AND" />
              <FormControlLabel value="OR" control={<Radio />} label="OR" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <H2 sx={{ mt: 4 }}>検索結果</H2>

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
