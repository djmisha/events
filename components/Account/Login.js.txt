import { supabase } from "../../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "./Account";
import Image from "next/image";
import { useState } from "react";

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [open, SetOpen] = useState();

  const handleClick = () => {
    SetOpen(!open);
  };

  const handleOpenClass = () => {
    const openClass = open
      ? "login-overlay login-open"
      : "login-overlay login-closed";
    return openClass;
  };

  return (
    <>
      <div className="nav-login">
        <div className="" onClick={handleClick}>
          {!session && (
            <>
              <Image
                width={25}
                height={25}
                src="/images/icon-lock.svg"
                alt="Login"
              />
              <span>Login</span>
            </>
          )}
          {session && (
            <>
              <Image
                width={25}
                height={25}
                src="/images/icon-user.svg"
                alt="Profile"
              />
              <span>Profile</span>
            </>
          )}
        </div>
      </div>
      <div className={handleOpenClass()}>
        <div className="modal-close" onClick={handleClick}>
          <Image
            width={25}
            height={25}
            src="/images/icon-back.svg"
            alt="Menu"
          />
          <span>Back</span>
        </div>
        {!session && (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="default"
            providers={[]}
          />
        )}
        {session && <Account session={session} />}
      </div>
    </>
  );
};

export default Login;
