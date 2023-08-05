import { createContext } from "react";
import { Poppins } from "next/font/google";
import "../styles/global.scss";
// import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// import { SessionContextProvider } from "@supabase/auth-helpers-react";
// import { useState } from "react";

const context = createContext();

const poppins = Poppins({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

function App({ Component, pageProps }) {
  // const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <context.Provider value={context}>
      {/* <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      > */}
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
      {/* </SessionContextProvider> */}
    </context.Provider>
  );
}

export default App;
