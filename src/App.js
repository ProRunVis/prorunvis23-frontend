import React from 'react';
import './App.css';
import Navbar from "./classComponents/Navbar";
import LeftComponent from './classComponents/LeftComponent';
import Footer from './classComponents/Footer';





// Das ist die Runner Funktion die auf der Hauptseite
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
