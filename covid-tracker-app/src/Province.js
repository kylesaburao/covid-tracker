import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@material-ui/core";
// import ToggleButton from "@material-ui/lab/ToggleButton";
// import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
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
import StatusBar from "./province/StatusBar";

const REPORTED_STATUS = "Reported";
const DEFAULT_DAY_WINDOW = 1;

function DataGraph({ statistics, keys = ["change_cases"] }) {
  const createDataPoint = (day, keys) => {
    let data = keys.reduce((accum, key) => {
      if (keys.includes(key)) {
        accum[key] = day[key];
      }
      return accum;
    }, {});

    data["date"] = day.date;

    return data;
  };

  const serializeData = (keys) => {
    let series = statistics.data.map((x) => createDataPoint(x, keys));
    return series;
  };

  let temp = serializeData(keys);

  return (
    // <ResponsiveContainer width={400} height={400}>
      <LineChart data={temp} width={400} height={400}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <XAxis dataKey="date" />
        <YAxis />
        {keys.map((key) => (
          <Line key={key} dataKey={key}></Line>
        ))}
      </LineChart>
    // </ResponsiveContainer>
  );
}

export default function Province({ provincialData }) {
  // const updateTime = new Date(Date.parse(provincialData.updated_at));
  // const dataReported = provincialData.data_status.includes(REPORTED_STATUS);
  // const reportText = dataReported
  //   ? `Updated today at ${updateTime.toLocaleTimeString()}`
  //   : "Current day update unavailable";

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
      <Grid container spacing={2}>
        <Grid container item xs={12}>
          <StatusBar report={currentReport} />
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <Grid item>
            <Paper>
              <DataGraph statistics={currentReport}></DataGraph>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <DataGraph
                statistics={currentReport}
                keys={["total_vaccinations", "change_vaccinations"]}
              ></DataGraph>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* 
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
*/}
    </>
  );
}
