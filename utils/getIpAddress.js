import locations from "./locations.json";

/**
 * Services to retreive the location based on user IP
 * IP -> Location -> Match to Location ID -> set in Local Storage
 */
export const UserLocationService = async () => {
  await getUserIPAddress();
};

/**
 * Retrieves Users IP Address from ipify.org
 * @returns Users IP Address
 */
const getUserIPAddress = async () => {
  const url = "https://api.ipify.org?format=json";

  await fetch(url)
    .then(function (response) {
      response.json().then((jsonData) => {
        getCityStateWithIp(jsonData.ip);
      });
    })

    .catch(function (error) {
      console.log(error);
    });
};

/**
 * Uses IP address to retrieve a physical location
 * @param {*} ip
 * @returns Physical Location based on IP Address
 */
const getCityStateWithIp = async (ip) => {
  var url = `https://ipapi.co/${ip}/json/`;

  await fetch(url)
    .then(function (response) {
      response.json().then((jsonData) => {
        setLocationID(jsonData);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

/**
 * Sets users location in Local Storage, and matches to an ID
 * @param {*} data - city and state returned from physical locaiton
 */
const setLocationID = (data) => {
  const { city, region_code: state } = data;

  let locationID;

  locations.forEach(function (item) {
    if (city === item.city) {
      locationID = item.id;
      return locationID;
    }
    if (!locationID && state === item.stateCode) {
      locationID = item.id;
      return locationID;
    }
  });

  // Set to Local Storage
  localStorage.setItem("city", city);
  localStorage.setItem("state", state);
  if (!locationID) localStorage.setItem("locID", 10); // If no match, use California
  localStorage.setItem("locID", locationID);

  return locationID;
};
