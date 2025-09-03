import React from 'react';
import ReactDOM from 'react-dom/client';
import '@atlaskit/css-reset';
import AppProvider from '@atlaskit/app-provider';

import DiscordUsers from './components/sections/DiscordUsers';
import './i18n/config'; // Set up i18n.

import './styles/table.css';
import './styles/rankable-table.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AppProvider>
    <DiscordUsers />
  </AppProvider>
);
