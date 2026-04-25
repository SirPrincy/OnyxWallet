import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// Initialize jeep-sqlite for web
const platform = Capacitor.getPlatform();
if (platform === 'web') {
  jeepSqlite(window);
  
  // Create the jeep-sqlite element
  const jeepSqliteElem = document.createElement('jeep-sqlite');
  document.body.appendChild(jeepSqliteElem);
}

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
