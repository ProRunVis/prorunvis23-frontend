import React, { useEffect, useRef } from 'react';
import './styling/App.css';
import Navbar from "./Navbar&Upload/Navbar";
import LeftComponent from './Navbar&Upload/LeftComponent';

import RightComponent from './Editor&Decoration/RightComponent';

// Überwacht Left&RightContainer, dass diese richtig resized werden. Kommt ansonsten zu RuntimeErrors weil zu viele resizes an DOM geschickt werden
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function App() {
  const contentRef = useRef(null); 

  useEffect(() => {
    
    const handleResize = debounce(() => {
      console.log('Containergröße hat sich geändert');
      
    }, 100); 

    const observer = new ResizeObserver(handleResize);
    if(contentRef.current) {
      observer.observe(contentRef.current); // Überwache den Container
    }

    return () => observer.disconnect(); // Cleanup-Funktion
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <div ref={contentRef} className="content">
          <LeftComponent />
          <RightComponent />
        </div>
        
      </header>
    </div>
  );
}

export default App;
