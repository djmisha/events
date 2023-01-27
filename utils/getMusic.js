import music from "./music.sample.json";
/**
 * Retreives data from SDHM site
 * @param {funciton} setMusic
 * @param {funciton} setMusicLoading
 */

const getMusic = (setMusic, setMusicLoading) => {
  if (process.env.NODE_ENV === "development") {
    return getSampleMusic(setMusic, setMusicLoading);
  } else {
    return getMusicProd(setMusic, setMusicLoading);
  }
};

const getProdMusic = async (setMusic, setMusicLoading) => {
  const rand = Math.floor(Math.random() * 20);
  const URL = `https://music.sandiegohousemusic.com/wp-json/wp/v2/posts?category=music&page=${rand}&per_page=4`;

  await fetch(URL)
    .then(function (response) {
      response.json().then((res) => {
        console.log(res);
        setMusic(res);
        setMusicLoading(false);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};

const getSampleMusic = async (setMusic, setMusicLoading) => {
  await music;
  setMusic(music);
  setMusicLoading(false);
};

export default getMusic;
