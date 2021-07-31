import "./App.css";
import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";

import * as api from "./api/api";

import Province from "./Province";
import ProvincialList from "./ProvincialList";

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
    <div>
      <Grid
        container
        spacing={4}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item>
          <h1>Provincial Data</h1>
        </Grid>
        {apiBusy && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={1}>
        <Grid container item direction="column" xs={3}>
          <Grid item>
            <ProvincialList
              provinces={provincialData}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
            ></ProvincialList>
          </Grid>
          <Grid item>
            <p>Data provided by {api.API_TRUE_URL}</p>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          {selectedProvince && selectedProvince in provincialMap && (
            <Province
              provincialData={provincialMap[selectedProvince]}
            ></Province>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
