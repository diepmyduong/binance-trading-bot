import { Children, MutableRefObject, useEffect, useRef, useState } from "react";

interface PropsType extends ReactProps {
  index?: number;
  bodyClassName?: string;
}

export function TabButtonGroup({ index = 0, bodyClassName = "", ...props }: PropsType) {
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
                className={`w-32 text-sm cursor-pointer flex justify-center items-center py-1 px-1 rounded border border-gray-400 ${
                  selectedIndex == index ? " text-white bg-primary " : "text-gray-500"
                } ${index == 0 && "border-r-0 rounded-r-none"} ${
                  index == tabs.length - 1 && "border-l-0 rounded-l-none"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {tab.label}
              </a>
            ))}
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
TabButtonGroup.Tab = Tab;
