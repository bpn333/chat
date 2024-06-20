import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Sign from './Sign.jsx';
import App from "./App";
import { FirebaseProvider } from './FirebaseProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Sign />} />
          <Route path='/chat' element={<App />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  </React.StrictMode>
);
