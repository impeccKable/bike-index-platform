// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from "recoil";
import { AuthProvider } from "./services/AuthProvider";
import { Suspense } from "react";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
  <RecoilRoot>
  <Suspense>
  <AuthProvider>
    <App />
  </AuthProvider>
  </Suspense>
  </RecoilRoot>
  </BrowserRouter>
);
