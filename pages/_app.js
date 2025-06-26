import { AppProvider } from "../features/AppContext";
import { Poppins } from "next/font/google";
import ToastProvider from "../components/ui/ToastProvider";
import "../styles/global.scss";

const poppins = Poppins({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className={poppins.className}>
        <Component {...pageProps} />
        <ToastProvider />
      </div>
    </AppProvider>
  );
}

export default App;
