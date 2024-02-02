import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './ComponentsBeforeBackend/App.js'; 
import App2 from './ComponentsBeforeBackend/App2.js'; 

function RoutingClass() {
 return (
     <Router>
       <Routes>
         <Route path="/" element={<Navigate replace to="/project-one" />} /> 
         <Route path="/project-one" element={<App />} /> 
         <Route path="/project-two" element={<App2 />} /> 
       </Routes>
     </Router>
 );
}

export default RoutingClass;
