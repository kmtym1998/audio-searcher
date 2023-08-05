import React from 'react';
import './App.css';
import { AudioSearch } from './components/feature/AudioSearch';
import { Box } from '@mui/material';

export const App: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <AudioSearch />
    </Box>
  );
};
