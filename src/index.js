// import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './Header';
import Footer from './Footer';
import Second from './Second';
import Third from './Third';
import Forth from './Forth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginPage from './GoogleLoginPage';


const Googlelogin = () => {
  return (
    <GoogleOAuthProvider clientId="11697718537-dqjd46buavim9ufcdipmvpfe3ksvt5lk.apps.googleusercontent.com">
      <GoogleLoginPage />
    </GoogleOAuthProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Router>
      <Routes>
        <Route path='/' element={<Header />} />
        <Route path='/login' element={<Googlelogin />} />
        <Route path='/footer' element={<Footer />} />
        <Route path='/second' element={<Second />} />
        <Route path='/third' element={<Third />} />
        <Route path='/forth' element={<Forth />} />
        {/* <Route path='/event' element={<Event />} /> */}
      </Routes>
    </Router>
  </>
)

reportWebVitals();
