import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";

import * as api from "./api/api";

export default function Province({ provincialData }) {
  const updateTime = new Date(Date.parse(provincialData.updated_at));
  const dataReported = provincialData.data_status.includes("Reported");
  const reportText = dataReported
    ? `Updated at ${updateTime.toLocaleTimeString()}`
    : "Waiting for report";

  const [currentReport, setCurrentReport] = useState({});

  useEffect(() => {
    if (dataReported) {
      api.getProvincalReport((data) => {
        if (data && data.data.length > 0) {
          setCurrentReport(data.data[0]);
          console.log(data.data[0]);
        }
      }, provincialData.code);
    }
  }, [provincialData.code]);

  return (
    <Card>
      <h2>{provincialData.name}</h2>
      <p>
        <em>{reportText}</em>
      </p>
      <table>
        <tbody>
          <tr>
            <th>Population</th>
            <td>{provincialData.population}</td>
          </tr>
          {dataReported && (
            <>
              <tr>
                <th>Δ Cases</th>
                <td>{currentReport.change_cases}</td>
              </tr>
              <tr>
                <th>Δ Deaths</th>
                <td>{currentReport.change_fatalities}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </Card>
  );
}
