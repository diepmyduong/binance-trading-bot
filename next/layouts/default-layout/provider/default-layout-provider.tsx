import { createContext } from "react";
import useScreen from "../../../lib/hooks/useScreen";

export const DefaultLayoutContext = createContext<any>({});
export function DefaulLayoutProvider(props) {
  const screen = useScreen("sm");
  return <DefaultLayoutContext.Provider value={{}}>{props.children}</DefaultLayoutContext.Provider>;
}
