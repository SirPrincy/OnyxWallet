import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';

// Initialize jeep-sqlite for web
const platform = Capacitor.getPlatform();
if (platform === 'web') {
  jeepSqlite(window);
  
  // Create the jeep-sqlite element
  const jeepSqliteElem = document.createElement('jeep-sqlite');
  document.body.appendChild(jeepSqliteElem);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
