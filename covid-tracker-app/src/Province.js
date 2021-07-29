import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import * as api from "./api/api";
import "./Province.css";

const REPORTED_STATUS = "Reported";
const DEFAULT_DAY_WINDOW = 1;

const _annotateValueSign = (value, toInteger = true) => {
  return value !== undefined && value !== null
    ? `${value >= 0 ? "+" : ""}${toInteger ? value.toFixed(0) : value}`
    : "N/A";
};

class Statistics {
  constructor(dailyValues) {
    const CHANGE_WINDOWS = [1, 7];
    const CHANGE_KEYS =
      dailyValues.length > 0
        ? Object.keys(dailyValues[0]).filter((key) => this._isChange(key))
        : [];

    this.data = dailyValues;
    this.days = this.data.length;

    this.statistics = {
      totals: this._extractTotals(this.data),
      changes: {},
    };

    // Calculate the window average for each change key
    CHANGE_KEYS.forEach((key) => {
      CHANGE_WINDOWS.forEach((window) => {
        let actualWindow = 0;
        let min = undefined;
        let max = 0;
        let average = 0;

        for (
          let i = 0;
          i < window && 0 <= this.days - i - 1 && this.days - i - 1 < this.days;
          ++i
        ) {
          const value = this.data[this.days - i - 1][key];

          if (min === undefined || value < min) {
            min = value;
          }

          if (value > max) {
            max = value;
          }

          average += value;
          actualWindow++;
        }

        average /= this.days;

        this.statistics.changes[key] = {
          ...this.statistics.changes[key],
          [actualWindow]: { min, max, average },
        };
      });
    });
  }

  _extractTotals(data) {
    let totals = {};

    if (data.length > 0) {
      Object.entries(data[data.length - 1]).forEach(([key, value]) => {
        if (this._isTotal(key)) {
          totals[key] = value;
        }
      });
    }

    return totals;
  }

  _isTotal(key) {
    return key.startsWith("total_");
  }

  _isChange(key) {
    return key.startsWith("change_");
  }
}

export default function Province({ provincialData }) {
  const updateTime = new Date(Date.parse(provincialData.updated_at));
  const dataReported = provincialData.data_status.includes(REPORTED_STATUS);
  const reportText = dataReported
    ? `Updated today at ${updateTime.toLocaleTimeString()}`
    : "Current day update unavailable";

  const [currentReport, setCurrentReport] = useState({
    available: false,
  });
  const [dayWindow, setDayWindow] = useState(DEFAULT_DAY_WINDOW);

  useEffect(() => {
    const startDate =
      dayWindow === 1 ? null : api.daysFromNow(-(dayWindow - 1));

    const dataKeys = [
      "cases",
      "vaccinations",
      "hospitalizations",
      "criticals",
      "fatalities",
    ];
    const reportedKeys = dataKeys
      .map((key) => `change_${key}`)
      .concat(dataKeys.map((key) => `total_${key}`));

    api
      .getProvincialReport(provincialData.code, api.daysFromNow(0), startDate)
      .then((data) => {
        if (data && data.data.length > 0) {
          const filteredData = data.data;
          const statistics = new Statistics(filteredData);
          console.log(provincialData.code, statistics);
        }
      });
  }, [provincialData.code, dayWindow]);

  return (
    <Card className="card">
      <CardContent>
        <h2>{provincialData.name}</h2>
        <p>
          <em>{reportText}</em>
        </p>
        <table>
          <tbody>
            <tr>
              <th>Population</th>
              <td>{provincialData.population}</td>
            </tr>
            {currentReport.available && (
              <>
                <tr>
                  <th>Vaccinations</th>
                  <td>{currentReport.total_vaccinations}</td>
                  <td>
                    ({_annotateValueSign(currentReport.change_vaccinations)})
                  </td>
                </tr>
                <tr>
                  <th>Cases</th>
                  <td>{currentReport.total_cases}</td>
                  <td>({_annotateValueSign(currentReport.change_cases)})</td>
                </tr>
                <tr>
                  <th>Deaths</th>
                  <td>{currentReport.total_fatalities}</td>
                  <td>
                    ({_annotateValueSign(currentReport.change_fatalities)})
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <button
          onClick={() => {
            setDayWindow(1);
          }}
        >
          1
        </button>
        <button
          onClick={() => {
            setDayWindow(7);
          }}
        >
          7
        </button>
        <p>{dayWindow} day average</p>
      </CardContent>
    </Card>
  );
}
