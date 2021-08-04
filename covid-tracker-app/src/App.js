import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as api from "./api/api";
import "./App.css";
import Province from "./Province";
import ProvincialList from "./ProvincialList";

function LoadingSpinner({ isLoading }) {
  return isLoading && <CircularProgress />;
}

function App() {
  const [provincialData, setProvincialData] = useState([]);
  const [provincialMap, setProvincialMap] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [apiBusy, setApiBusy] = useState(false);

  api.registerBusySignaller((state) => {
    setApiBusy(state);
  });

  useEffect(() => {
    api.getProvinces().then((data) => {
      const compareProvince = (province1, province2) =>
        province1.name.localeCompare(province2.name);
      data.sort(compareProvince);

      setProvincialData(data);
      setSelectedProvince(data[0].code);
      setProvincialMap(
        data.reduce((dict, current) => {
          dict[current.code] = current;
          return dict;
        }, {})
      );
    });
  }, []);

  return (
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
        xs={3}
        style={{ minWidth: "16em" }}
      >
        <Grid item>
          <ProvincialList
            provinces={provincialData}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
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
