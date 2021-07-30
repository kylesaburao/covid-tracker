import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import * as api from "./api/api";
import "./Province.css";
import Statistics from "./api/statistics";

const REPORTED_STATUS = "Reported";
const DEFAULT_DAY_WINDOW = 1;

const _annotateValueSign = (value, toInteger = true) => {
  return value !== undefined && value !== null
    ? `${value >= 0 ? "+" : ""}${toInteger ? value.toFixed(0) : value}`
    : "N/A";
};

function DataGraph({ statistics }) {
  // const

  const createDataPoint = ({
    date,
    change_cases,
    change_vaccinations,
    change_fatalities,
  }) => {
    return { date, change_cases, change_vaccinations, change_fatalities };
  };

  const serializeData = (keysTODO = []) => {
    let series = statistics.data.map((x) => createDataPoint(x));
    return series;
  };

  const keys = ["change_cases"];

  let temp = serializeData(keys[0]);
  console.log(temp);

  return (
    <LineChart data={temp} width={500} height={300}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="change_cases"></Line>
      <Line type="monotone" dataKey="change_fatalities"></Line>
    </LineChart>
  );
}

function DataTable({ statistics, keyPairs, windowSize }) {
  const createDataTitle = (key) => {
    if (key.length === 0) {
      return "";
    }

    const parts = key.split("_");
    const title = parts[parts.length - 1];

    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <>
      <table>
        <tbody>
          {keyPairs.map(([type, total, change]) => (
            <tr key={type}>
              <th>{createDataTitle(total)}</th>
              <td>{statistics.getTotal(total)}</td>
              <td>
                {_annotateValueSign(
                  statistics.getChange(change, windowSize).average
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function Province({ provincialData }) {
  const updateTime = new Date(Date.parse(provincialData.updated_at));
  const dataReported = provincialData.data_status.includes(REPORTED_STATUS);
  const reportText = dataReported
    ? `Updated today at ${updateTime.toLocaleTimeString()}`
    : "Current day update unavailable";

  const [currentReport, setCurrentReport] = useState(new Statistics([]));
  const [dayWindow, setDayWindow] = useState(DEFAULT_DAY_WINDOW);
  const MAX_DAY_WINDOW = 14;

  const handleDayWindowChange = (event, value) => {
    if (value !== null && value !== undefined) {
      setDayWindow(value);
    }
  };

  useEffect(() => {
    const startDate = api.daysFromNow(-(MAX_DAY_WINDOW - 1));

    api
      .getProvincialReport(provincialData.code, api.daysFromNow(0), startDate)
      .then((data) => {
        if (data && data.data.length > 0) {
          const filteredData = data.data;
          const statistics = new Statistics(filteredData);
          setCurrentReport(statistics);
        }
      });
  }, [provincialData.code]);

  return (
    <>
      <h2>{provincialData.name}</h2>
      <p>
        <em>{reportText}</em>
      </p>

      <Grid container spacing={3}>
        <Grid item>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item>
              <DataTable
                statistics={currentReport}
                keyPairs={["cases", "vaccinations", "fatalities"].map((key) => [
                  key,
                  `total_${key}`,
                  `change_${key}`,
                ])}
                windowSize={dayWindow}
                setDayWindow={setDayWindow}
              ></DataTable>
            </Grid>
            <Grid item>
              <ToggleButtonGroup
                value={dayWindow}
                onChange={handleDayWindowChange}
                exclusive
              >
                {[1, 7, 14].map((value) => (
                  <ToggleButton key={value} value={value}>
                    {value === dayWindow ? `${value} day window` : value}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <div height="300px" width="300px">
            <DataGraph statistics={currentReport}></DataGraph>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
