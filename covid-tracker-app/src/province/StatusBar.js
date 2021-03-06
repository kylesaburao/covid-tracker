import React from "react";
import { Grid, Card, CardContent } from "@mui/material";

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
  isDarkMode = false,
}) {
  const delta = report.getChange(changeKey, 1).average;
  const changeText = `Δ ${isUpdated ? _annotateValueSign(delta) : "N/A"}`;

  const changeColor = isUpdated
    ? isIncreaseBad && delta > 0
      ? "red"
      : "green"
    : !isDarkMode
    ? "black"
    : "white";

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

export default function StatusBar({ report, updateTime, isUpdated = false }) {
  const keys = [
    ["hospitalizations", true, true],
    ["criticals", true, true],
    ["cases", true],
    ["tests", false],
    ["vaccinations", false],
    ["recoveries", false],
    ["fatalities", true],
  ].map(([x, isIncreaseBad, isDarkMode]) => [
    x,
    `total_${x}`,
    `change_${x}`,
    isIncreaseBad,
    isDarkMode,
  ]);

  const reportText =
    isUpdated && updateTime
      ? `Updated today @ ${updateTime.toLocaleTimeString()}`
      : "Daily update unavailable";

  return (
    <Card style={{ width: "100%" }}>
      <CardContent style={{ padding: ".5em" }}>
        <Grid
          spacing={2}
          container
          justifyContent="flex-start"
          direction="row"
          alignItems="stretch"
        >
          {keys.map(([key, totalKey, changeKey, isIncreaseBad, isDarkMode]) => (
            <Grid
              item
              xs
              key={key}
              style={{
                backgroundColor: isDarkMode ? "#263238" : "white",
                color: isDarkMode ? "white" : "black",
              }}
            >
              <StatusBarItem
                dataKey={key}
                totalKey={totalKey}
                changeKey={changeKey}
                report={report}
                isUpdated={isUpdated}
                isIncreaseBad={isIncreaseBad}
                isDarkMode={isDarkMode}
              />{" "}
            </Grid>
          ))}
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
              {reportText}
            </span>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
