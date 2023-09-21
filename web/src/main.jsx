import React from 'react'
import './custom-theme.scss';
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { ChakraProvider } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async';
import { store } from "./app/store"
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <HelmetProvider>
      <Provider store={store}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
