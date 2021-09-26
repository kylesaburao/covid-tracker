import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as api from "./api/api";
import Statistics from "./api/statistics";
import "./Province.css";
import { ReportSection } from "./province/ReportSection";
import StatusBar from "./province/StatusBar";
import VaccinationData from "./province/VaccinationData";

const REPORTED_STATUS = "Reported";
const DEFAULT_DAY_WINDOW = 7;

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
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="stretch"
      style={{ padding: "1em" }}
    >
      <Grid container item>
        <StatusBar
          report={currentReport}
          isUpdated={dataReported}
          updateTime={updateTime}
        />
      </Grid>

      <Grid container item>
        {!currentReport.EMPTY && (
          <ReportSection
            report={currentReport}
            isTodayReported={dataReported}
            windowSize={dayWindow}
            handleWindowChange={handleDayWindowChange}
          ></ReportSection>
        )}
      </Grid>

      <Grid container item>
        <Grid item xs>
          <VaccinationData provincialData={provincialData} />
        </Grid>
      </Grid>
    </Grid>
  );
}
