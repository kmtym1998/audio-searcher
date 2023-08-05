import styled from '@emotion/styled';
import { Box, Card } from '@mui/material';
import type { CardProps } from '@mui/material';
import React from 'react';
import { ClipboardChip } from '../../components/common/ClipboardChip';
import { type AudioFileNode } from '../../../graphql/graphql';

type SearchResultBoxProps = {
  node: AudioFileNode;
} & CardProps;

export const SearchResultBox: React.FC<SearchResultBoxProps> = ({
  node,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <ResultRowBox>
        ファイル:{' '}
        {node.filePath && (
          <ClipboardChip label={node.fileName} copyValue={node.filePath} />
        )}
      </ResultRowBox>
      <ResultRowBox>
        タイトル: {node.title && <ClipboardChip label={node.title} />}
      </ResultRowBox>
      <ResultRowBox>
        アーティスト:{' '}
        {node.artists.map((artist, i) => (
          <ClipboardChip key={i} label={artist} />
        ))}
      </ResultRowBox>
      <ResultRowBox>
        トラック:
        {node.containedTracks.map((track, i) => (
          <ClipboardChip key={i} label={track} />
        ))}
      </ResultRowBox>
      <ResultRowBox>
        アルバム:
        {node.album && <ClipboardChip label={node.album} />}
      </ResultRowBox>
      <ResultRowBox>
        アルバムアーティスト:
        {node.albumArtist && <ClipboardChip label={node.albumArtist} />}
      </ResultRowBox>
      <ResultRowBox>
        タグ:
        {node.tags.map((tag, i) => (
          <ClipboardChip key={i} label={tag} />
        ))}
      </ResultRowBox>
    </Card>
  );
};

const ResultRowBox = styled(Box)(() => ({
  marginTop: '1rem',
  marginBottom: '1rem',
}));
