import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { startBoot } from './boot';

startBoot();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Transitions off: a route change always swaps the page immediately instead of waiting in the background */}
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
