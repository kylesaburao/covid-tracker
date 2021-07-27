import axios from "axios";

/*
  https://api.covid19tracker.ca/docs/1.0/overview


  https://opencovid.ca/api/#version

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

function _daysFrom(date, delta = 1) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + delta);
  return newDate;
}

export function daysFromNow(delta = 0) {
  return _daysFrom(new Date(Date.now()), delta);
}

function _toAPICompatibleDate(date = daysFromNow(0)) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function _get(location, onSuccess, onFailure = null, params = {}) {
  axios
    .get(`${API_URL}${location}`, { params: params })
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

export function getSummary(callback) {
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

  _get(API_LOCATIONS.summary, (result) => {
    const data = result.data.data[0];
    const displayedData = {};

    Object.entries(data).forEach(([key, value]) => {
      displayedData[createDataTitle(key)] = value;
    });

    callback(displayedData);
  });
}

export function getProvinces(callback, geographicOnly = true) {
  _get(
    API_LOCATIONS.provinces,
    (result) => {
      callback(result.data);
    },
    null,
    { geo_only: geographicOnly }
  );
}

export function getProvincialReport(
  callback,
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
    throw "Invalid arguments";
  }

  _get(
    `${API_LOCATIONS.reports}/province/${provinceCode}`,
    (result) => {
      callback(result.data);
    },
    null,
    params
  );
}
