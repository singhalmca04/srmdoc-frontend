import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import Header from './Header';

function App(props) {
  useEffect(()=>{
    const a = [1,2,3,4];
    const b = [...a, 5,6];
    console.log(b);
    const {age} = props;
    console.log(`Age is ${age}`); 
  })
  return (
    <div className="App">
      
      <header className="App-header">
        {/* Name is {age} */}
        <img src={logo} className="App-logo" alt="logo" />
        <Header />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React part 256565656
        </a>
      </header>
    </div>
  );
}

export default App;
