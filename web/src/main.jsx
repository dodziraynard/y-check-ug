import React from 'react'
import './custom-theme.scss';
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { ChakraProvider } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
