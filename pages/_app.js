import "../styles/global.scss";
import store from "../features/store";
import { Provider } from "react-redux";

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
