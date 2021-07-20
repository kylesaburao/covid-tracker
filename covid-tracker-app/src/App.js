import "./App.css";
import React, { useState, useEffect } from "react";

import Card from "@material-ui/core/Card";
import * as api from "./api/api";

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

  useEffect(() => {
    api.getSummary((data) => {
      setTempData(data);
      setReady(true);
    });
  }, []);

  return (
    <div>
      <h1>Test Data</h1>
      {ready ? <Summary data={tempData}></Summary> : <p>Loading</p>}
    </div>
  );
}

export default App;
