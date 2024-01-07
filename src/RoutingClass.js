import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './ComponentsBeforeBackend/App'; // Ensure this is the correct component for ProjectOne
import App2 from './ComponentsAfterBackend/RunnerAndLayout/App2'; // Ensure this is the correct component for ProjectTwo

function RoutingClass() {
 return (
   
     <Router>
       <Routes>
         <Route path="/" element={<Navigate replace to="/project-one" />} /> {/* Redirects from root to /project-one */}
         <Route path="/project-one" element={<App />} /> {/* ProjectOne is rendered here */}
         <Route path="/project-two" element={<App2 />} /> {/* ProjectTwo is rendered here */}
       </Routes>
     </Router>
   
 );
}

export default RoutingClass;
