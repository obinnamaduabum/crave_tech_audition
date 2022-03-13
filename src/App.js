import './App.css';
import {Phase} from "./body/phase/Phase";
import React from "react";

function App() {

  const taskList = localStorage.getItem("taskList");
  if(!taskList) {
    localStorage.setItem('taskList', JSON.stringify([]));
  }

  return (
      <div className="my-container">
        <div className="row">
          <div className="col col-lg-5 col-md-6 col-xs-12">
            <Phase />

            <div className={'separator'}>
              <hr/>
            </div>
          </div>
          <div className="col col-lg-7 col-md-6 col-xs-12">
          </div>
        </div>

      </div>
  );
}

export default App;
