import React from 'react';
import './App.css';
import CheckboxList from './Checklist';

const App = () => (

  <div className="App">
    <header className="App-header">
      <h1 className="App-title">
        React Checklist Exercise
      </h1>
    </header>
    <div>
      <div className="listclass">
        <CheckboxList />
      </div>
    </div>
  </div>

);

export default App;
