import axios from "axios";

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
    { geo_only: true }
  );
}

export function getProvincalReport(callback, provinceCode, date = null) {
  if (!date) {
    const currentDate = new Date(Date.now());
    date = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
  }

  _get(
    `${API_LOCATIONS.reports}/province/${provinceCode}`,
    (result) => {
      callback(result.data);
    },
    null,
    {
      date: date,
    }
  );
}
