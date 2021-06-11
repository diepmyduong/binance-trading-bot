import { Children, MutableRefObject, useEffect, useRef, useState } from "react";

interface PropsType extends ReactProps {
  index?: number;
  bodyClassName?: string;
}

export function TabGroup({ index = 0, bodyClassName = "", ...props }: PropsType) {
  const getUUID = () => Math.floor(Math.random() * 10) + new Date().getTime().toString(36);
  const [id, setId] = useState<string>(getUUID());
  const inkbarRef: MutableRefObject<HTMLDivElement> = useRef();
  const [tabs, setTabs] = useState<{ label: string; child: JSX.Element }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(index);

  useEffect(() => {
    setTabs(
      Children.map(props.children, (child) =>
        child?.type?.displayName === "Tab" ? { label: child.props.label, child } : null
      ).filter(Boolean)
    );
  }, [props.children]);

  useEffect(() => {
    if (inkbarRef.current && tabs[selectedIndex]) {
      const el = document.getElementById(id + "-" + selectedIndex);
      if (el) {
        inkbarRef.current.style.width = el.offsetWidth + "px";
        inkbarRef.current.style.left = el.offsetLeft + "px";
      }
    }
  }, [inkbarRef.current, tabs, selectedIndex]);

  return (
    <>
      {tabs.length && (
        <>
          <div id={id} className="relative flex justify-center bg-white w-full">
            {tabs.map((tab, index) => (
              <a
                key={index}
                id={id + "-" + index}
                className={`flex-1 w-full text-gray-700 md:max-w-xs text-center font-semibold text-sm md:text-sm cursor-pointer flex justify-center items-center h-12 px-1 ${
                  selectedIndex == index ? "text-primary" : "text-gray-500"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {tab.label}
              </a>
            ))}
            <div
              className="absolute bottom-0 h-1 bg-primary transition-all ease-in-out duration-300"
              ref={inkbarRef}
            ></div>
          </div>
          <div className={`w-full ${bodyClassName}`}>{tabs[selectedIndex]?.child}</div>
        </>
      )}
    </>
  );
}

interface TabPropsType extends ReactProps {
  label: string;
}
const Tab = ({ children }: TabPropsType) => children;
Tab.displayName = "Tab";
TabGroup.Tab = Tab;
