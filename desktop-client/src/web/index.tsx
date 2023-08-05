import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import ApolloProvider from '../providers/ApolloProvider';
import { MenuAppBar } from './components/feature/layout/MenuAppBar';

createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <ApolloProvider>
      <MenuAppBar title="Audio Searcher" />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
