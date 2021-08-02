import React, { useEffect, useState } from "react";
import { Card } from "@material-ui/core";
import * as api from "../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function createVaccinationDataset(ageData) {
  const extractFirstDigit = (str) => {
    const matchData = str.match(/\d+/);
    if (matchData) {
      return parseInt(matchData[0]);
    }
    return 0;
  };

  return Object.entries(ageData)
    .filter(([key, _]) => key.search(/\d+/) !== -1)
    .sort(
      ([key_a, data_a], [key_b, data_b]) =>
        extractFirstDigit(key_a) - extractFirstDigit(key_b)
    )
    .map(([key, data]) => {
      return { group: key, full: data.full, partial: data.partial };
    });
}

export default function VaccinationData({ provincialData }) {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    api.getProvincialVaccinations(provincialData.code).then((data) => {
      const vaccinationData = data.data;
      const length = vaccinationData.length;
      if (length > 0) {
        const mostRecent = vaccinationData[length - 1];
        const mostRecentData = JSON.parse(mostRecent.data);
        setDataset(createVaccinationDataset(mostRecentData));
      }
    });
  }, [provincialData.code]);

  return (
    <Card>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={dataset}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="partial" stackId="a" fill="#c2e699" />
          <Bar dataKey="full" stackId="a" fill="#78c679" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
