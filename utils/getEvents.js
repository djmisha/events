const apikeys = {
  API_KEY_EDMTRAIN: "47211b0d-26f7-424c-b81c-45613a70f865",
  API_URL_EDMTRAIN: "https://edmtrain.com/api/events?locationIds=",
  API_KEY_IPSTACK: "316340baee8e3995e8d261a746a2571a",
};

const getEvents = async (cityID, locations) => {
  let data = [];
  const { API_URL_EDMTRAIN, API_KEY_EDMTRAIN } = apikeys;
  const url = API_URL_EDMTRAIN + cityID + "&client=" + API_KEY_EDMTRAIN;

  await fetch(url)
    .then(function (response) {
      response.json().then((res) => {
        data = res.data;
        console.log(data);
        return data;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

export default getEvents;
