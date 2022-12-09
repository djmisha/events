const getEventsForLocation = async (id, setEvents, setLoading) => {
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const URL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  const PATH = URL + id + "&client=" + KEY;
  await fetch(PATH)
    .then(function (response) {
      response.json().then((res) => {
        setEvents(res.data);
        setLoading(false);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};

export default getEventsForLocation;
