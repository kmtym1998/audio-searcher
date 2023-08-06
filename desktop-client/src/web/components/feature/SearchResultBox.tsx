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
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // FIXME: うまく型がつかない
    const windowWithElectron = globalThis.window as any;
    windowWithElectron?.electron?.startDrag(node.filePath);
  };

  return (
    <Card draggable={true} onDragStart={handleDragStart} {...cardProps}>
      <ResultRow>
        ファイル:{' '}
        {node.filePath && (
          <ClipboardChip label={node.fileName} copyValue={node.filePath} />
        )}
      </ResultRow>
      <ResultRow>
        タイトル: {node.title && <ClipboardChip label={node.title} />}
      </ResultRow>
      <ResultRow>
        アーティスト:{' '}
        {node.artists.map((artist, i) => (
          <ClipboardChip key={i} label={artist} />
        ))}
      </ResultRow>
      <ResultRow>
        トラック:
        {node.containedTracks.map((track, i) => (
          <ClipboardChip key={i} label={track} />
        ))}
      </ResultRow>
      <ResultRow>
        アルバム:
        {node.album && <ClipboardChip label={node.album} />}
      </ResultRow>
      <ResultRow>
        アルバムアーティスト:
        {node.albumArtist && <ClipboardChip label={node.albumArtist} />}
      </ResultRow>
      <ResultRow>
        タグ:
        {node.tags.map((tag, i) => (
          <ClipboardChip key={i} label={tag} />
        ))}
      </ResultRow>
    </Card>
  );
};

const ResultRow = styled(Box)(() => ({
  marginTop: '1rem',
  marginBottom: '1rem',
}));
