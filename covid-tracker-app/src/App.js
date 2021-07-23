import "./App.css";
import React, { useState, useEffect } from "react";

import Card from "@material-ui/core/Card";
import * as api from "./api/api";

import Province from "./Province";

const Summary = ({ data }) => (
  <Card>
    <h2>Canada</h2>
    {/* <table>
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
    </table> */}
  </Card>
);

const ProvincialList = ({ provinces }) => {
  return (
    <ul style={{ listStyleType: "none" }}>
      {provinces &&
        provinces.map((province) => (
          <li key={province.id}>
            <Province provincialData={province}></Province>
          </li>
        ))}
    </ul>
  );
};

function App() {
  // Temporary data display
  const [tempData, setTempData] = useState({});

  const [provincialData, setProvincialData] = useState([]);

  useEffect(() => {
    api.getSummary((data) => {
      setTempData(data);
    });

    api.getProvinces((data) => {
      setProvincialData(data);
    });
  }, []);

  return (
    <div>
      <h1>Test Data</h1>
      <Summary data={tempData}></Summary>
      <ProvincialList provinces={provincialData}></ProvincialList>
    </div>
  );
}

export default App;
