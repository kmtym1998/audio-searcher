'use client';

import Typography, { type TypographyProps } from '@mui/material/Typography';
import React from 'react';

export const H3: React.FC<TypographyProps> = ({ children, sx }) => {
  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontSize: '1.5rem',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};
