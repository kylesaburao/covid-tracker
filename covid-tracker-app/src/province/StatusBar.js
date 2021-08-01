import React from "react";
import { Grid, Card, CardContent } from "@material-ui/core";

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

function StatusBarItem({
  dataKey,
  totalKey,
  changeKey,
  report,
  isUpdated = false,
  isIncreaseBad = true,
}) {
  const delta = report.getChange(changeKey, 1).average;
  const changeText = `Δ ${isUpdated ? _annotateValueSign(delta) : "N/A"}`;

  const changeColor = isUpdated
    ? isIncreaseBad && delta > 0
      ? "red"
      : "green"
    : "black";

  return (
    <div className="status-item">
      <p className="status-title">{capitalize(dataKey)}</p>
      <p className="status-total">{report.getTotal(totalKey)}</p>
      <p className="status-change">
        <span style={{ color: changeColor }}>{changeText}</span>
      </p>
    </div>
  );
}

export default function StatusBar({ report, isUpdated = false }) {
  const keys = [
    ["cases", true],
    ["tests", false],
    ["vaccinations", false],
    ["hospitalizations", true],
    ["criticals", true],
    ["recoveries", false],
    ["fatalities", true],
  ].map(([x, isIncreaseBad]) => [
    x,
    `total_${x}`,
    `change_${x}`,
    isIncreaseBad,
  ]);

  return (
    <Card style={{ width: "100%" }}>
      <CardContent style={{ padding: ".5em" }}>
        <Grid
          spacing={2}
          container
          justifyContent="space-between"
          direction="row"
          alignItems="stretch"
        >
          {keys.map(([key, totalKey, changeKey, isIncreaseBad], index) => (
            <Grid item key={key}>
              <StatusBarItem
                dataKey={key}
                totalKey={totalKey}
                changeKey={changeKey}
                report={report}
                isUpdated={isUpdated}
                isIncreaseBad={isIncreaseBad}
              />{" "}
            </Grid>
          ))}
          {!isUpdated && (
            <Grid
              container
              item
              xs={12}
              style={{
                backgroundColor: "#263238",
                color: "white",
              }}
            >
              <span style={{ fontStyle: "italic", fontSize: "smaller" }}>
                Daily update unavailable
              </span>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
