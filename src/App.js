import React from 'react';
import './App.css';
import Navbar from "./classComponents/Navbar";
import MainComponent from './classComponents/MainComponent';
import Footer from './classComponents/Footer';





// Das ist die Runner Funktion die auf der Haupt
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className ="container">
          <Navbar />
          <MainComponent />          
          <Footer />
        </div>        
      </header>
    </div>
  );
}

export default App;
