
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 index.tsx carregado');

const rootElement = document.getElementById('root');
console.log('🔍 Root element:', rootElement);

if (!rootElement) throw new Error("Could not find root element to mount to");

console.log('✅ Montando React App');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log('✅ App renderizado');
