import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Starting msvc worker in development mode
if (import.meta.env.DEV) {
  import('./mocks/browser.js').then(({ setupMocks }) => {
    setupMocks().then(() => {
      createRoot(document.getElementById('root')).render(<App />)
    })
  })
} else {
  createRoot(document.getElementById('root')).render(<App />)
}
