import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" toastOptions={{ style: { background: '#111122', color: '#e0e4ff', border: '1px solid #1e1e38', borderRadius: '8px', fontSize: '13px' } }} />
  </React.StrictMode>
)
