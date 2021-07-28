import "./App.css";
import React, { useState, useEffect } from "react";

import * as api from "./api/api";

import ProvincialList from "./ProvincialList";

function App() {
  const [provincialData, setProvincialData] = useState([]);

  useEffect(() => {
    api.getProvinces().then((data) => {
      setProvincialData(data);
    });
  }, []);

  return (
    <div>
      <h1>Provincial Data</h1>
      <ProvincialList provinces={provincialData}></ProvincialList>
    </div>
  );
}

export default App;
