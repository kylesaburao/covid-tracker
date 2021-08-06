import React from "react";

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

import * as api from "../api/api";
const shajs = require("sha.js");

function createDataPoint(day, keys) {
  let data = keys.reduce((accum, key) => {
    if (keys.includes(key)) {
      accum[key] = day[key];
    }
    return accum;
  }, {});

  data["date"] = day.date;

  return data;
}

function serializeData(keys, statistics, todayReported) {
  const today = api.toAPICompatibleDate(api.daysFromNow(0));

  let series = statistics.data
    .filter((day) => {
      // Skip today's data if it was unreported
      const isToday = day.date === today;
      return !isToday || (isToday && todayReported);
    })
    .map((x) => createDataPoint(x, keys));

  return series;
}

function generateColor(seed = "") {
  // Create a deterministic color based on the name of the key
  const hash = shajs("sha256").update(seed).digest("hex").slice(0, 6);
  return `#${hash}`;
}

export default function ReportGraph({
  statistics,
  keyState = {},
  todayReported = false,
}) {
  const keys = Object.keys(keyState).filter((key) => keyState[key]);

  return (
    <ResponsiveContainer width="95%" height={350}>
      <LineChart
        data={serializeData(keys, statistics, todayReported)}
        style={{ margin: "0.5em" }}
      >
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
