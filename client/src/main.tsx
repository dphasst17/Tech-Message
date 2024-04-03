import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'
import { ApiProvider } from './context/apiContext.tsx'
import { StateProvider } from './context/stateContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StateProvider>
      <ApiProvider>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </ApiProvider>
    </StateProvider>
  </React.StrictMode>,
)
