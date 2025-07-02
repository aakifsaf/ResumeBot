import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> { /* Wrap with AuthProvider */ }
        <App />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1A202C',
            color: '#EDF2F7',
            borderRadius: '8px',
          },
        }} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
