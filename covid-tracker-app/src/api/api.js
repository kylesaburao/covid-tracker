import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import Cache from "timed-cache";

const dataCache = new Cache({ defaultTtl: 1000 * 60 });
const PROVINCIAL_CACHE_KEY = "provincial";
const PROVINCIAL_REPORT_CACHE_KEY = "provincial_report";
const SUMMARY_CACHE_KEY = "summary";

/*
  https://api.covid19tracker.ca/docs/1.0/overview
*/

export const API_TRUE_URL = "api.covid19tracker.ca";
const API_URL = "http://localhost:81/proxy";
const API_LOCATIONS = {
  summary: "/summary",
  cases: "/cases",
  reports: "/reports",
  fatalities: "/fatalities",
  provinces: "/provinces",
  regions: "/regions",
};

const axiosCache = setupCache({ maxAge: 1000 * 60, exclude: { query: false } });
const axiosAPI = axios.create({ adapter: axiosCache.adapter });

function createCacheKey(items) {
  return items.map((item) => JSON.stringify(item)).join(".");
}

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

export function toAPICompatibleDate(date = daysFromNow(0)) {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const dateValue = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${dateValue}`;
}

let _signaller = null;

export function registerBusySignaller(signaller) {
  _signaller = signaller;
}

function _signalBusy(isBusy) {
  if (_signaller) {
    _signaller(isBusy);
  }
}

function _get(location, onSuccess, onFailure, params = {}) {
  console.log("GET", currentTime(), location, params);
  _signalBusy(true);

  axiosAPI({ url: _constructURL(location), method: "get", params: params })
    .then(async (result) => {
      onSuccess(result);
      _signalBusy(false);
    })
    .catch((error) => {
      if (onFailure) {
        onFailure(error);
      }
      console.log(`API ERROR: ${error}`);
      _signalBusy(false);
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
    const cacheKey = createCacheKey([PROVINCIAL_CACHE_KEY, geographicOnly]);
    const cachedData = dataCache.get(cacheKey);
    if (cachedData !== undefined) {
      resolve(cachedData);
      return;
    }

    _get(
      API_LOCATIONS.provinces,
      (result) => {
        resolve(result.data);
        dataCache.put(cacheKey, result.data);
      },
      reject,
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
    params["after"] = toAPICompatibleDate(startDate);
  } else if (date !== null) {
    params["date"] = toAPICompatibleDate(date);
  } else {
    throw new Error("Invalid arguments");
  }

  params = { ...params, fill_dates: false };
  const cacheKey = createCacheKey([
    PROVINCIAL_REPORT_CACHE_KEY,
    provinceCode,
    params,
  ]);

  return new Promise((resolve, reject) => {
    const cacheItem = dataCache.get(cacheKey);
    if (cacheItem !== undefined) {
      resolve(cacheItem);
      return;
    }

    _get(
      `${API_LOCATIONS.reports}/province/${provinceCode}`,
      (result) => {
        resolve(result.data);

        dataCache.put(cacheKey, result.data);
      },
      reject,
      params
    );
  });
}
