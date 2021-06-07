import Link from "next/link";
import { useContext, useState } from "react";

import { useAuth } from "../../../../lib/providers/auth-provider";
import { Login } from "./components/login";
import { Recovery } from "./components/recovery";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "recovery">("login");
  const { user } = useAuth();

  return (
    <div className="md:h-screen">
      <div className="w-screen h-full bg-center bg-no-repeat bg-cover flex-col flex-center ">
        <div className="relative w-full h-screen flex flex-col items-center  shadow-lg rounded-lg ">
          <div className="flex items-center justify-center flex-col md:flex-row w-full h-screen">
            <div className="relative flex flex-col w-4/6 rounded-md items-center justify-center p-4 sm:p-8 md:p-10 md:pt-12 bg-white ">
              <div className="hidden md:block">
                <Link href="/">
                  <a className="">
                    <img src="/assets/img/logo.png" className="w-40" />
                  </a>
                </Link>
              </div>
              {
                {
                  login: <Login setMode={setMode} />,
                  recovery: <Recovery setMode={setMode} />,
                }[mode]
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
