import React from 'react';
import './App.css';
import Navbar from "./classComponents/Navbar";
import LeftComponent from './classComponents/LeftComponent';
import Footer from './classComponents/Footer';





// Runner Function that merges all components into site
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className ="container">
          <Navbar />
          <LeftComponent />          
          <Footer />
        </div>        
      </header>
    </div>
  );
}

export default App;
