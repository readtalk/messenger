import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  
import './App.css'    
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('SW registered: ', reg))
      .catch(err => console.log('SW registration failed: ', err));
  });
}
