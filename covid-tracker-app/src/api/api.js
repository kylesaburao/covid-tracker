import axios from "axios";

const API_URL = "http://localhost:81/proxy";
const API_LOCATIONS = {
  summary: "/summary",
  cases: "/cases",
  reports: "/reports",
  fatalities: "/fatalities",
  provinces: "/provinces",
  regions: "/regions",
};

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

  axios.get(`${API_URL}${API_LOCATIONS.summary}`).then((res) => {
    const data = res.data.data[0];
    const displayedData = {};

    Object.entries(data).forEach(([key, value]) => {
      displayedData[createDataTitle(key)] = value;
    });

    callback(displayedData);
  });
}
