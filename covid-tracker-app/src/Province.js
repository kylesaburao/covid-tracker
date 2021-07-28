import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import * as api from "./api/api";
import "./Province.css";

const REPORTED_STATUS = "Reported";
const DEFAULT_DAY_WINDOW = 1;

const _annotateValueSign = (value, toInteger = true) => {
  return value !== undefined && value !== null
    ? `${value >= 0 ? "+" : ""}${toInteger ? value.toFixed(0) : value}`
    : "N/A";
};

export default function Province({ provincialData }) {
  const updateTime = new Date(Date.parse(provincialData.updated_at));
  const dataReported = provincialData.data_status.includes(REPORTED_STATUS);
  const reportText = dataReported
    ? `Updated today at ${updateTime.toLocaleTimeString()}`
    : "Daily report unavailable";

  const [currentReport, setCurrentReport] = useState({
    message: "Unavailable",
  });
  const [dayWindow, setDayWindow] = useState(DEFAULT_DAY_WINDOW);

  useEffect(() => {
    const startDate =
      dayWindow === 1 ? null : api.daysFromNow(-(dayWindow - 1));

    const dataKeys = [
      "cases",
      "vaccinations",
      "hospitalizations",
      "criticals",
      "fatalities",
    ];
    const reportedKeys = dataKeys
      .map((key) => `change_${key}`)
      .concat(dataKeys.map((key) => `total_${key}`));

    api
      .getProvincialReport(provincialData.code, api.daysFromNow(0), startDate)
      .then((data) => {
        if (data && data.data.length > 0) {
          const filteredData = data.data;
          const dayCount = filteredData.length;

          const processedData = Object.entries(
            filteredData.reduce((accum, currentDay) => {
              reportedKeys.forEach((key) => {
                if (!(key in accum)) {
                  accum[key] = 0;
                }

                if (key.startsWith("total_")) {
                  accum[key] = currentDay[key];
                } else if (key.startsWith("change_")) {
                  accum[key] += currentDay[key];
                }
              });

              return accum;
            }, {})
          ).reduce((acuum, [key, value]) => {
            acuum[key] = value;
            if (key.includes("change_")) {
              acuum[key] /= dayCount;
            }

            return acuum;
          }, {});

          setCurrentReport(processedData);
        }
      });
  }, [provincialData.code, dayWindow]);

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
                    ({_annotateValueSign(currentReport.change_vaccinations)})
                  </td>
                </tr>
                <tr>
                  <th>Cases</th>
                  <td>{currentReport.total_cases}</td>
                  <td>({_annotateValueSign(currentReport.change_cases)})</td>
                </tr>
                <tr>
                  <th>Deaths</th>
                  <td>{currentReport.total_fatalities}</td>
                  <td>
                    ({_annotateValueSign(currentReport.change_fatalities)})
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <button
          onClick={() => {
            setDayWindow(1);
          }}
        >
          1
        </button>
        <button
          onClick={() => {
            setDayWindow(7);
          }}
        >
          7
        </button>
        <p>{dayWindow} day average</p>
      </CardContent>
    </Card>
  );
}
