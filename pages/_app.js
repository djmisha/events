import { createContext } from "react";
import { Poppins } from "next/font/google";
import "../styles/global.scss";

const context = createContext();

const poppins = Poppins({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

function App({ Component, pageProps }) {
  return (
    <context.Provider value={context}>
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
    </context.Provider>
  );
}

export default App;
