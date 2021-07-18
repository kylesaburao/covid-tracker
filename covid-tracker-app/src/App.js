import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const TempDataDisplay = ({ data }) => (
  <table>
    <tbody>
      {Object.entries(data).map(([key, value]) => {
        return (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

function App() {
  // Temporary data display
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:81/proxy/summary").then((res) => {
      console.log("polling");
      const data = res.data.data[0];
      const keys = new Set(["latest_date", "total_cases", "total_vaccinated"]);

      const displayedData = {};

      for (let key in data) {
        if (keys.has(key)) {
          console.log(data[key]);
          displayedData[key] = data[key];
        }
      }

      setTempData(displayedData);
    });
  }, []);

  return (
    <div>
      <h1>Test Data</h1>
      <TempDataDisplay data={tempData}></TempDataDisplay>
    </div>
  );
}

export default App;
