/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Buffer } from 'buffer';

// Secondary protection and Buffer polyfill
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  // global and process already handled in index.html, but double check
  if (!(window as any).global) (window as any).global = window;
  if (!(window as any).process) (window as any).process = { env: {} };
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
