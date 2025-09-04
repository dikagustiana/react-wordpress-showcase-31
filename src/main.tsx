import React from 'react'
import { createRoot } from 'react-dom/client'
import { RoleProvider } from './contexts/RoleContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <RoleProvider>
    <App />
  </RoleProvider>
);
