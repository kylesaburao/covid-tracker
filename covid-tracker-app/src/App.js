import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as api from "./api/api";
import "./App.css";
import Province from "./Province";
import ProvincialList from "./ProvincialList";

function LoadingSpinner({ isLoading }) {
  return isLoading && <CircularProgress />;
}

function ScreenLoading({ progress }) {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <CircularProgress variant="determinate" value={progress} />
    </Grid>
  );
}

function App() {
  const [provincialData, setProvincialData] = useState([]);
  const [provincialMap, setProvincialMap] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [apiBusy, setApiBusy] = useState(false);
  const [readyStatus, setReadyStatus] = useState(0);

  const selectProvince = (
    provinceCode = undefined,
    defaultCode = undefined
  ) => {
    const localStorage = window.localStorage;
    const previouslySelectedCode = localStorage.getItem("selectedProvince");

    if (provinceCode) {
      setSelectedProvince(provinceCode);
      localStorage.setItem("selectedProvince", provinceCode);
    } else if (previouslySelectedCode && provinceCode === undefined) {
      setSelectedProvince(previouslySelectedCode);
    } else if (defaultCode) {
      setSelectedProvince(defaultCode);
      localStorage.setItem("selectedProvince", defaultCode);
    }
  };

  useEffect(() => {
    api.registerBusySignaller((state) => {
      setApiBusy(state);
    });

    api.getProvinces().then((data) => {
      setReadyStatus(50);
      const compareProvince = (province1, province2) =>
        province1.name.localeCompare(province2.name);
      data.sort(compareProvince);

      setProvincialData(data);

      if (data.length > 0) {
        selectProvince(undefined, data[0].code);
      }

      setProvincialMap(
        data.reduce((dict, current) => {
          dict[current.code] = current;
          return dict;
        }, {})
      );

      // Wait for in-memory data to be ready
      setTimeout(() => {
        setReadyStatus(75);
        setTimeout(() => setReadyStatus(100), 100);
      }, 50);
    });
  }, []);

  return readyStatus !== 100 ? (
    <ScreenLoading progress={readyStatus} />
  ) : (
    <Grid
      container
      style={{ margin: 0, padding: 0, height: "100vh" }}
      spacing={0}
    >
      {/* Header */}
      <Grid
        container
        item
        xs={12}
        spacing={0}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        style={{
          backgroundColor: "#263238",
          color: "white",
        }}
        id="header"
      >
        <Grid item>
          <h1>Provincial Data</h1>
        </Grid>
        <Grid item>
          <LoadingSpinner isLoading={apiBusy} />
        </Grid>
      </Grid>

      {/* Province list */}
      <Grid
        container
        item
        direction="column"
        xs={2}
        style={{ minWidth: "15em" }}
      >
        <Grid item>
          <ProvincialList
            provinces={provincialData}
            selectedProvince={selectedProvince}
            setSelectedProvince={selectProvince}
          ></ProvincialList>
        </Grid>
        <Grid item>
          <p>
            <a href="https:api.covid19tracker.ca/docs/1.0/overview">
              Data provided by {api.API_TRUE_URL}
            </a>
          </p>
        </Grid>
      </Grid>

      {/* Province data */}
      <Grid container item xs style={{ maxHeight: "90vh", overflow: "auto" }}>
        <Grid item>
          {selectedProvince && selectedProvince in provincialMap && (
            <Province
              provincialData={provincialMap[selectedProvince]}
            ></Province>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
