import axios from "axios";
import { setupCache } from "axios-cache-adapter";

/*
  https://api.covid19tracker.ca/docs/1.0/overview
*/

const API_URL = "http://localhost:81/proxy";
const API_LOCATIONS = {
  summary: "/summary",
  cases: "/cases",
  reports: "/reports",
  fatalities: "/fatalities",
  provinces: "/provinces",
  regions: "/regions",
};

const axiosCache = setupCache({ maxAge: 1000 * 60 });
const axiosAPI = axios.create({ adapter: axiosCache.adapter });

function _constructURL(location) {
  return `${API_URL}${location}`;
}

function _daysFrom(date, delta = 1) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + delta);
  return newDate;
}

export function daysFromNow(delta = 0) {
  return _daysFrom(new Date(Date.now()), delta);
}

export function currentTime() {
  return daysFromNow().getTime();
}

function _toAPICompatibleDate(date = daysFromNow(0)) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function _get(location, onSuccess, onFailure, params = {}) {
  axiosAPI({ url: _constructURL(location), method: "GET", params: params })
    .then((result) => {
      onSuccess(result);
    })
    .catch((error) => {
      if (onFailure) {
        onFailure(error);
      } else {
        console.log(`API ERROR: ${error}`);
      }
    });
}

export function getSummary() {
  const createDataTitle = (title) => {
    return title
      .split("_")
      .map((word) => {
        return word.length > 0
          ? `${word.charAt(0).toLocaleUpperCase()}${word.substring(1)}`
          : word;
      })
      .join(" ");
  };

  return new Promise((resolve, reject) => {
    _get(API_LOCATIONS.summary, (result) => {
      const data = result.data.data[0];
      const displayedData = {};

      Object.entries(data).forEach(([key, value]) => {
        displayedData[createDataTitle(key)] = value;
      });

      resolve(displayedData);
    });
  });
}

export function getProvinces(geographicOnly = true) {
  return new Promise((resolve, reject) => {
    _get(
      API_LOCATIONS.provinces,
      (result) => {
        resolve(result.data);
      },
      null,
      { geo_only: geographicOnly }
    );
  });
}

/**
 *
 * @param {*} provinceCode Provincial code as per API specifications
 * @param {*} date Date of report
 * @param {*} startDate Starting date of a number of consecutive reports to today. Overrides date.
 */
export function getProvincialReport(
  provinceCode,
  date = daysFromNow(0),
  startDate = null
) {
  let params = {};

  if (startDate !== null) {
    params["after"] = _toAPICompatibleDate(startDate);
  } else if (date !== null) {
    params["date"] = _toAPICompatibleDate(date);
  } else {
    throw new Error("Invalid arguments");
  }

  return new Promise((resolve, reject) => {
    _get(
      `${API_LOCATIONS.reports}/province/${provinceCode}`,
      (result) => {
        resolve(result.data);
      },
      null,
      params
    );
  });
}
