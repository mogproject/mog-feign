import React from 'react';
import ReactDOM from 'react-dom/client';
import '@atlaskit/css-reset';
import AppProvider from '@atlaskit/app-provider';

import DiscordUsers from './components/sections/DiscordUsers';
import './i18n/config'; // Set up i18n.

import './styles/table.css';

// Workaround for Atlassian Design System.
// @see https://community.developer.atlassian.com/t/console-warnings-when-feature-gate-can-not-be-evaluated/93025
window.__CRITERION__ = { getFeatureFlagOverride: () => false };

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AppProvider>
    <DiscordUsers />
  </AppProvider>
);
