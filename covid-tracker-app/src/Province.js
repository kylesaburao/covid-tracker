import { Card, Grid, Paper } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as api from "./api/api";
import Statistics from "./api/statistics";
import "./Province.css";
import StatusBar from "./province/StatusBar";
import VaccinationData from "./province/VaccinationData";

const shajs = require("sha.js");

const REPORTED_STATUS = "Reported";
const DEFAULT_DAY_WINDOW = 7;

function DataGraph({
  statistics,
  keys = ["change_cases"],
  todayReported = false,
}) {
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
    const today = api.toAPICompatibleDate(api.daysFromNow(0));

    let series = statistics.data
      .filter((day) => {
        // Skip today's data if it was unreported
        const isToday = day.date === today;
        return !isToday || (isToday && todayReported);
      })
      .map((x) => createDataPoint(x, keys));

    return series;
  };

  let temp = serializeData(keys);

  const generateColor = (seed = "") => {
    // Create a deterministic color based on the name of the key
    const hash = shajs("sha256").update(seed).digest("hex").slice(0, 6);
    return `#${hash}`;
  };

  return (
    <ResponsiveContainer width="95%" height={400}>
      <LineChart data={temp} style={{ margin: "0.5em" }}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <XAxis dataKey="date" />
        <YAxis domain={[0, "auto"]} allowDataOverflow={true} />
        {keys.map((key) => (
          <Line
            dot={false}
            key={key}
            dataKey={key}
            stroke={generateColor(key)}
          ></Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function Province({ provincialData }) {
  const updateTime = new Date(Date.parse(provincialData.updated_at));
  const dataReported = provincialData.data_status.includes(REPORTED_STATUS);

  const [currentReport, setCurrentReport] = useState(new Statistics([]));
  const [dayWindow, setDayWindow] = useState(DEFAULT_DAY_WINDOW);

  const handleDayWindowChange = (event, value) => {
    if (value !== null && value !== undefined) {
      setDayWindow(value);
    }
  };

  useEffect(() => {
    const startDate = api.daysFromNow(-(dayWindow - 1));

    api
      .getProvincialReport(provincialData.code, api.daysFromNow(0), startDate)
      .then((data) => {
        if (data && data.data.length > 0) {
          const filteredData = data.data;
          const statistics = new Statistics(filteredData);
          setCurrentReport(statistics);
        }
      });
  }, [provincialData.code, dayWindow]);

  return (
    <Paper>
      <Grid
        container
        spacing={0}
        direction="column"
        justifyContent="space-around"
        alignItems="flex-start"
        style={{padding: "1em", marginLeft: "0.25em"}}
      >
        <Grid container item>
          <StatusBar
            report={currentReport}
            isUpdated={dataReported}
            updateTime={updateTime}
          />
        </Grid>
        <Grid container item spacing={0}>
          <Grid item xs={6}>
            <Card>
              <DataGraph
                statistics={currentReport}
                keys={[
                  "change_cases",
                  "change_criticals",
                  "change_hospitalizations",
                  "change_fatalities",
                ]}
                todayReported={dataReported}
              ></DataGraph>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <DataGraph
                statistics={currentReport}
                keys={[
                  // "total_vaccinations",
                  "total_cases",
                  "total_criticals",
                  "total_hospitalizations",
                  "total_fatalities",
                ]}
                todayReported={dataReported}
              ></DataGraph>
            </Card>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={1}>
            <ToggleButtonGroup
              value={dayWindow}
              size="small"
              onChange={handleDayWindowChange}
              exclusive
            >
              {[7, 14, 31, 365].map((value) => (
                <ToggleButton key={value} value={value}>
                  {value === dayWindow ? `${value} days` : value}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={6}>
        <h3>Vaccinations</h3>
            <VaccinationData provincialData={provincialData} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
