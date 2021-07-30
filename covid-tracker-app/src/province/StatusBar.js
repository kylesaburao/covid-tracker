import React from "react";
import { Grid, Paper } from "@material-ui/core";

import "./StatusBar.css";

const _annotateValueSign = (value, toInteger = true) => {
  return value !== undefined && value !== null
    ? `${value >= 0 ? "+" : ""}${toInteger ? value.toFixed(0) : value}`
    : "N/A";
};

// Capitalize the first letter of a word
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function StatusBarItem({ dataKey, totalKey, changeKey, report }) {
  return (
    <div className="status-item">
      <p className="status-title">{capitalize(dataKey)}</p>
      <p className="status-total">{report.getTotal(totalKey)}</p>
      <p className="status-change">
        {_annotateValueSign(report.getChange(changeKey, 1).average)}
      </p>
    </div>
  );
}

export default function StatusBar({ report }) {
  const keys = [
    "cases",
    "tests",
    "vaccinations",
    "hospitalizations",
    "criticals",
    "recoveries",
    "fatalities",
  ].map((x) => [x, `total_${x}`, `change_${x}`]);

  return (
    <Paper style={{ width: "100%" }}>
      <Grid
        spacing={2}
        container
        justifyContent="space-between"
        direction="row"
        alignItems="stretch"
      >
        {keys.map(([key, totalKey, changeKey], index) => (
          <Grid item key={key}>
            <StatusBarItem
              dataKey={key}
              totalKey={totalKey}
              changeKey={changeKey}
              report={report}
            />{" "}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
