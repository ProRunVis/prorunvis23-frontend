import React from 'react';
import './App.css';
import Navbar from "./classComponents/Navbar";
import LeftComponent from './classComponents/LeftComponent';
import Footer from './classComponents/Footer';
import RightComponent from './classComponents/RightComponent';





// Runner Function that merges all components into site
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Navbar />
        <div className ="content">
          
          <LeftComponent />   
          <RightComponent />       
        
        </div>    
        <Footer />    
      </header>
    </div>
  );
}

export default App;
