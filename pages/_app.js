import { Poppins } from "@next/font/google";
import "../styles/global.scss";
import store from "../features/store";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../lib/apollo";

const poppins = Poppins({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

function App({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;
