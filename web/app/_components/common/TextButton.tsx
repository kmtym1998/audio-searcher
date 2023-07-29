'use client';

import Button from '@mui/material/Button';
import React, { PropsWithChildren } from 'react';

export const TextButton: React.FC<PropsWithChildren> = ({ children }) => {
  return <Button variant="text">{children}</Button>;
};
