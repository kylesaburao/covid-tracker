import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import * as api from "./api/api";
import "./Province.css";

const annotateValueSign = (value) => {
  return value !== undefined && value !== null
    ? `${value >= 0 ? "+" : ""}${value}`
    : "N/A";
};

export default function Province({ provincialData }) {
  const updateTime = new Date(Date.parse(provincialData.updated_at));
  const dataReported = provincialData.data_status.includes("Reported");
  const reportText = dataReported
    ? `Updated today at ${updateTime.toLocaleTimeString()}`
    : "Daily report unavailable";

  const [currentReport, setCurrentReport] = useState({});

  useEffect(() => {
    if (dataReported) {
      api.getProvincialReport(provincialData.code).then((data) => {
        if (data && data.data.length > 0) {
          setCurrentReport(data.data[0]);
        }
      });
    }
  }, [provincialData.code, dataReported]);

  return (
    <Card className="card">
      <CardContent>
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
                  <th>Vaccinations</th>
                  <td>{currentReport.total_vaccinations}</td>
                  <td>
                    ({annotateValueSign(currentReport.change_vaccinated)})
                  </td>
                </tr>
                <tr>
                  <th>Cases</th>
                  <td>{currentReport.total_cases}</td>
                  <td>({annotateValueSign(currentReport.change_cases)})</td>
                </tr>
                <tr>
                  <th>Deaths</th>
                  <td>{currentReport.total_fatalities}</td>
                  <td>
                    ({annotateValueSign(currentReport.change_fatalities)})
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
