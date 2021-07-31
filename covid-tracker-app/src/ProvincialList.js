import React from "react";
import { MenuItem, MenuList } from "@material-ui/core";

export default function ProvincialList({
  provinces,
  setSelectedProvince,
  selectedProvince,
}) {
  const isReported = (province) => province.data_status === "Reported";

  return (
    <MenuList>
      {provinces.map((province) => (
        <MenuItem
          key={province.code}
          onClick={() => {
            setSelectedProvince(province.code);
          }}
          selected={province.code === selectedProvince}
        >
          <span>
            {province.name}
            {!isReported(province) && (
              <span
                style={{
                  fontSize: "smaller",
                  fontStyle: "italic",
                }}
              >
                {" "}
                Unreported
              </span>
            )}
          </span>
        </MenuItem>
      ))}
    </MenuList>
  );
}
