import React from 'react';
import ReactDOM from 'react-dom/client';
import '@atlaskit/css-reset';
import AppProvider from '@atlaskit/app-provider';
import './i18n/config'; // Set up i18n.

import App from './App';

// Workaround for Atlassian Design System.
// @see https://community.developer.atlassian.com/t/console-warnings-when-feature-gate-can-not-be-evaluated/93025
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error: __CRITERION__ is injected at runtime by Atlassian tooling
window.__CRITERION__ = { getFeatureFlagOverride: () => false };

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);
