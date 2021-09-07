import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React, { useState } from "react";
import ReportGraph from "./ReportGraph";

function createDefaultKeyState(report) {
  const defaultEnabled = new Set(["change_cases"]);

  const state = report.getDataKeys().reduce((accum, curr) => {
    accum[curr] = defaultEnabled.has(curr);
    return accum;
  }, {});

  return state;
}

function CapitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function PrettifyKey(key) {
  return key
    .split("_")
    .map((x) => CapitalizeFirstLetter(x))
    .join(" ");
}

function KeyToggle({ keyState, handleKeyEvent }) {
  const keys = Object.keys(keyState);

  return (
    <FormGroup row>
      {keys.map((key) => {
        return (
          <FormControlLabel
            key={key}
            label={
              <Typography variant="caption">{PrettifyKey(key)}</Typography>
            }
            control={
              <Checkbox
                name={key}
                checked={keyState[key]}
                onChange={handleKeyEvent}
              ></Checkbox>
            }
          ></FormControlLabel>
        );
      })}
    </FormGroup>
  );
}

export function ReportSection({
  report,
  isTodayReported,
  windowSize,
  handleWindowChange,
}) {
  const windowSizes = [7, 14, 31, 365];
  const [keyState, setKeyState] = useState(createDefaultKeyState(report));

  const handleKeyEvent = (event) => {
    setKeyState({ ...keyState, [event.target.name]: event.target.checked });
  };

  return (
    <Card>
      <CardContent>
        <Grid
          container
          item
          direction="column"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Grid item>
            <ReportGraph
              statistics={report}
              keyState={keyState}
              todayReported={isTodayReported}
            ></ReportGraph>
          </Grid>
          <Grid container item>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h4>Controls</h4>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container item>
                  <Grid item>
                    <ToggleButtonGroup
                      value={windowSize}
                      size="small"
                      onChange={handleWindowChange}
                      exclusive
                    >
                      {windowSizes.map((value) => (
                        <ToggleButton key={value} value={value}>
                          {value === windowSize ? `${value} days` : value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid item>
                    <KeyToggle
                      keyState={keyState}
                      handleKeyEvent={handleKeyEvent}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
