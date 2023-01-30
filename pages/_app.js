import { Poppins } from "@next/font/google";
import "../styles/global.scss";
import store from "../features/store";
import { Provider } from "react-redux";

const poppins = Poppins({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

function App({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default App;
