'use client';

import { Box, TextField } from '@mui/material';
import React from 'react';
import { H1 } from '@/app/_components/common/H1';
import { type AudioFileNodeQueryInput } from '@/graphql/graphql';

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

  return (
    <Box>
      <H1>SearchForm</H1>

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
              const value = event.target.value;
              if (hasMany) {
                setQuery(
                  (prev) =>
                    ({
                      ...prev,
                      [name]: [...(prev[name] ?? []), value],
                    } as AudioFileNodeQueryInput),
                );
              } else {
                setQuery((prev) => ({ ...prev, [name]: value }));
              }
            }}
          />
        </Box>
      ))}
    </Box>
  );
};
