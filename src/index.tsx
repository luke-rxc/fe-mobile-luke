import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { DeviceDetectProvider } from '@contexts/DeviceDetectContext';
import { FeatureFlagsProvider } from '@contexts/FeatureFlagsContext';
import AppMeta from './AppMeta';
import AppHead from './AppHead';
import App from './App';
import reportWebVitals from './reportWebVitals';

const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <DeviceDetectProvider>
          <HelmetProvider>
            <FeatureFlagsProvider>
              <AppMeta />
              <AppHead />
              <App />
            </FeatureFlagsProvider>
          </HelmetProvider>
        </DeviceDetectProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
