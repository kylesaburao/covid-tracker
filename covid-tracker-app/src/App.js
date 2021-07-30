import "./App.css";
import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";

import * as api from "./api/api";

import Province from "./Province";
import ProvincialList from "./ProvincialList";

function App() {
  const [provincialData, setProvincialData] = useState([]);
  const [provincialMap, setProvincialMap] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");

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
      <h1>Provincial Data</h1>
      <Grid container spacing={10}>
        <Grid item>
          <ProvincialList
            provinces={provincialData}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
          ></ProvincialList>
        </Grid>
        <Grid item>
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
