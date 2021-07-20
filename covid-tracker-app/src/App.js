import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Card from "@material-ui/core/Card";

const Summary = ({ data }) => (
  <Card>
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
  </Card>
);

function App() {
  // Temporary data display
  const [tempData, setTempData] = useState({});
  const [ready, setReady] = useState(false);

  const API_URL = "http://localhost:81/proxy";
  const API_LOCATIONS = {
    summary: "/summary",
  };

  useEffect(() => {
    axios.get(`${API_URL}${API_LOCATIONS.summary}`).then((res) => {
      const createDataTitle = (title) => {
        return title
          .split("_")
          .map((word) => {
            return word.length > 0
              ? `${word.charAt(0).toLocaleUpperCase()}${word.substring(1)}`
              : word;
          })
          .join(" ");
      };

      const data = res.data.data[0];
      const displayedData = {};

      for (let key in data) {
        displayedData[createDataTitle(key)] = data[key];
      }

      setTempData(displayedData);
      setReady(true);
    });
  }, [API_LOCATIONS.summary]);

  return (
    <div>
      <h1>Test Data</h1>
      {ready ? <Summary data={tempData}></Summary> : <p>Loading</p>}
    </div>
  );
}

export default App;
