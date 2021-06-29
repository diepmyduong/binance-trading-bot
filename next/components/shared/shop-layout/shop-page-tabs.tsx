import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

interface PropsType extends ReactProps {
  options: Option[];
  value: any;
  onChange?: (val) => any;
}
export function ShopPageTabs({ options, value, onChange, ...props }: PropsType) {
  const getUUID = () => Math.floor(Math.random() * 10) + new Date().getTime().toString(36);
  const [id, setId] = useState<string>(getUUID());
  const inkbarRef: MutableRefObject<HTMLDivElement> = useRef();
  const [selected, setSelected] = useState(value);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    function handleResize() {
      setWindowSize(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let index = options.findIndex((x) => x.value == selected);
    if (inkbarRef.current && index >= 0) {
      const el = document.getElementById(id + "-" + index);
      if (el) {
        inkbarRef.current.style.width = el.offsetWidth + "px";
        inkbarRef.current.style.left = el.offsetLeft + "px";
      }
    }
  }, [inkbarRef.current, options, selected, windowSize]);

  return (
    <>
      {options?.length && (
        <div id={id} className="relative flex mt-2">
          {options.map((option, index) => (
            <a
              key={index}
              id={id + "-" + index}
              className={`cursor-pointer flex justify-center items-center py-4 px-0.5 mr-4 font-semibold ${
                selected == option.value ? " text-gray-900" : "text-gray-600"
              } hover:text-primary`}
              onClick={() => {
                setSelected(option.value);
                onChange(option.value);
              }}
            >
              {option.label}
            </a>
          ))}
          <div
            className="absolute bottom-0 h-1 bg-primary transition-all ease-in-out duration-300"
            ref={inkbarRef}
          ></div>
        </div>
      )}
    </>
  );
}
