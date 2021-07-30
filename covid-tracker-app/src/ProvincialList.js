import React from "react";
import { MenuItem, MenuList, Paper } from "@material-ui/core";

export default function ProvincialList({ provinces, selectedProvince, setSelectedProvince }) {
  return (
    <MenuList>
      {provinces.map((province) => (
        <MenuItem
          key={province.code}
          onClick={() => {
            setSelectedProvince(province.code);
          }}
        >
          {province.name}
        </MenuItem>
      ))}
    </MenuList>
  );
  // return (
  //   <Grid
  //     container
  //     direction="row"
  //     justifyContent="space-evenly"
  //     alignItems="flex-start"
  //     spacing={1}
  //   >
  //     {provinceList &&
  //       provinceList.map((province) => (
  //         <Grid item key={province.id}>
  //           <Province provincialData={province}></Province>
  //         </Grid>
  //       ))}
  //   </Grid>
  // );
}
