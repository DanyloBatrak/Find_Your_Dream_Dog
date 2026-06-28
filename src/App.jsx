import { useState } from "react";
import APIForm from "./component/APIForm";
import "./App.css";

function App() {
  return (
    <div>
      <div className="header">
        <h1>You need helper - Choose the dog</h1>
        <p>Discover our own dog based on description and traits</p>
      </div>
      <div className="main-window">
        <div className="api-box">
          <APIForm />
        </div>
      </div>
    </div>
  );
}

export default App;
