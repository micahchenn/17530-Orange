import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, World! This is TEAM ORANGE</h1>
      <button onClick={displayMessage}>Click Me</button>
    </div>
  );
}

function displayMessage() {
  console.log("JavaScript is initialized!");
}

export default App;