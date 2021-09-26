import { Card, MenuItem, MenuList } from "@mui/material";
import React from "react";

export default function ProvincialList({
  provinces,
  setSelectedProvince,
  selectedProvince,
}) {
  const isReported = (province) => province.data_status === "Reported";

  return (
    <Card>
      <MenuList style={{ padding: 0, backgroundColor: "#eceff1" }}>
        {provinces.map((province) => (
          <MenuItem
            key={province.code}
            onClick={() => {
              setSelectedProvince(province.code);
            }}
            selected={province.code === selectedProvince}
          >
            <span style={{ fontWeight: "bold" }}>
              {province.name}
              {!isReported(province) && (
                <span
                  style={{
                    fontSize: "smaller",
                    fontStyle: "italic",
                  }}
                >
                  {" "}
                  *
                </span>
              )}
            </span>
          </MenuItem>
        ))}
      </MenuList>
    </Card>
  );
}
