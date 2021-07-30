import React from "react";
import { MenuItem, MenuList } from "@material-ui/core";

export default function ProvincialList({ provinces, setSelectedProvince }) {
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
}
