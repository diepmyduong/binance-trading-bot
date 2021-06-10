import { createContext, useContext, useEffect, useState } from "react";
export const AccountContext = createContext<Partial<{}>>({});

export function AccountProvider(props) {
  const [step, setStep] = useState<any>(null);

  useEffect(() => {}, []);

  return <AccountContext.Provider value={{}}>{props.children}</AccountContext.Provider>;
}

export const useAccountContext = () => useContext(AccountContext);
