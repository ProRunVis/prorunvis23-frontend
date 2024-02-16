import React, { useEffect, useRef } from 'react';

import Navbar from "./Navbar&Upload/Navbar";
import LeftComponent from './Navbar&Upload/LeftComponent';
import RightComponent from './Editor&Decoration/RightComponent';


// Observes Left&RightContainer for correct resizing. Prohibits sending too many requests to DOM, which causes a Runtime Error
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

/**
 * Represents the main application component in the React application.
 * This component initializes a content area with dynamic resize handling.
 * It utilizes a ResizeObserver to monitor changes in the size of the container element
 * and debounces the resize events to limit the frequency of handling callbacks.
 * 
 * <p>Upon component mount, it sets up an observer on the content container to listen for resize events.
 * When the container's size changes, it logs a message indicating that the container size has changed.
 * This is intended to demonstrate how to handle dynamic content resizing in React components.
 * 
 * <p>The cleanup function returned by useEffect ensures that the observer is disconnected
 * when the component unmounts, preventing potential memory leaks.
 * 
 * @return A React component that displays the application layout, including a navbar
 *         and a content area divided into left and right components. The content area
 *         is monitored for size changes, demonstrating dynamic resize handling.
 */
function App() {
  const contentRef = useRef(null); 

  useEffect(() => {
    
    const handleResize = debounce(() => {
      console.log('Containergröße hat sich geändert');
      
    }, 100); 

    const observer = new ResizeObserver(handleResize);
    if(contentRef.current) {
      observer.observe(contentRef.current); 
    }

    return () => observer.disconnect(); // Cleanup-Function and disconnects
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
