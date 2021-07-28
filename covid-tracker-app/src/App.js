import "./App.css";
import React, { useState, useEffect } from "react";

import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import * as api from "./api/api";

import Province from "./Province";

const Summary = ({ data }) => (
  <></>
  // <Card>
  //   <h2>Canada</h2>
  //   {/* <table>
  //     <tbody>
  //       {Object.entries(data).map(([key, value]) => {
  //         return (
  //           <tr key={key}>
  //             <td>{key}</td>
  //             <td>{value}</td>
  //           </tr>
  //         );
  //       })}
  //     </tbody>
  //   </table> */}
  // </Card>
);

const ProvincialList = ({ provinces }) => {
  const provinceList = [...provinces];

  const compareProvince = (province1, province2) => {
    const REPORTED = "Reported";
    const province1Status = province1.data_status;
    const province2Status = province2.data_status;
    if (province1Status !== province2Status) {
      if (province1Status === REPORTED) {
        return -1;
      } else if (province2Status === REPORTED) {
        return 1;
      }
    }
    return province1.name.localeCompare(province2.name);
  };

  provinceList.sort(compareProvince);

  return (
    <Grid container
    direction="row"
    justifyContent="space-evenly"
    alignItems="flex-start"
    spacing={1}>
         {provinceList &&
        provinceList.map((province) => (
          <Grid item key={province.id}>
            <Province provincialData={province}></Province>
          </Grid>
        ))}
    </Grid>
  );
};

function App() {
  // Temporary data display
  const [tempData, setTempData] = useState({});

  const [provincialData, setProvincialData] = useState([]);

  useEffect(() => {
    api.getSummary((data) => {
      setTempData(data);
    });

    api.getProvinces((data) => {
      setProvincialData(data);
    });
  }, []);

  return (
    <div>
      <h1>Provincial Data</h1>
      <Summary data={tempData}></Summary>
      <ProvincialList provinces={provincialData}></ProvincialList>
    </div>
  );
}

export default App;
