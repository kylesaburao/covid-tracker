import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as api from "./api/api";
import "./App.css";
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
      <Grid container justifyContent="space-around" spacing={3}>
        <Grid
          container
          item
          xs={12}
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
        <Grid container item direction="column" xs={3}>
          <Grid item>
            <ProvincialList
              provinces={provincialData}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
            ></ProvincialList>
          </Grid>
          <Grid item>
            <p>
              <a href="https://api.covid19tracker.ca/docs/1.0/overview">
                Data provided by {api.API_TRUE_URL}
              </a>
            </p>
          </Grid>
        </Grid>
        <Grid item xs>
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
