import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ToastProvider from "./components/ToastProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider>
         <ToastProvider />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
  </StrictMode>
);
