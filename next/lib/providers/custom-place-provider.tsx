import { createContext, useContext, useState } from "react";
import { Card } from "../../components/shared/utilities/card/card";
export const CustomPlaceContext = createContext<{
  [x: string]: any;
  component?: JSX.Element;
  open?: (c: JSX.Element) => void;
  close?: () => void;
}>({});

export function CustomPlaceProvider(props) {
  const [component, setComponent] = useState<JSX.Element>();
  const open = (c: JSX.Element) => setComponent(c);
  const close = () => setComponent(null);
  return (
    <CustomPlaceContext.Provider value={{ open, close, component }}>
      {props.children}
    </CustomPlaceContext.Provider>
  );
}

export const useCustomPlaceContext = () => useContext(CustomPlaceContext);

CustomPlaceProvider.Card = () => {
  return (
    <CustomPlaceContext.Consumer>
      {({ component }) =>
        component && (
          <div className="relative">
            <div className="sticky top-6">
              <Card>{component}</Card>
            </div>
          </div>
        )
      }
    </CustomPlaceContext.Consumer>
  );
};
