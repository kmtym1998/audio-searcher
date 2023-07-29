'use client';

import Typography from '@mui/material/Typography';
import React from 'react';
import { PropsWithChildren } from 'react';

export const H1: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        fontSize: '2rem',
      }}
    >
      {children}
    </Typography>
  );
};
