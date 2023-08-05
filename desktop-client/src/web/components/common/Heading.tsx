import Typography, { type TypographyProps } from '@mui/material/Typography';
import React from 'react';

export const H1: React.FC<TypographyProps> = ({ children, sx }) => {
  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        fontSize: '2rem',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export const H2: React.FC<TypographyProps> = ({ children, sx }) => {
  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        fontSize: '1.5rem',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export const H3: React.FC<TypographyProps> = ({ children, sx }) => {
  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontSize: '1rem',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};
