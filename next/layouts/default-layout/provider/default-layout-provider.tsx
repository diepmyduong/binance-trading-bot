import { createContext, useContext } from "react";
import useScreen from "../../../lib/hooks/useScreen";
import { UserService } from "../../../lib/repo/user.repo";

export const DefaultLayoutContext = createContext<any>({});
export function DefaulLayoutProvider(props) {
  const screen = useScreen("sm");

  return <DefaultLayoutContext.Provider value={{}}>{props.children}</DefaultLayoutContext.Provider>;
}
export const useDefaultLayoutContext = () => useContext(DefaultLayoutContext);
