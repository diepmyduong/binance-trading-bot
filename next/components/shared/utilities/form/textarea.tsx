import { useEffect, useRef, MutableRefObject, useState } from "react";

export interface TextareaProps extends FormControlProps {
  rows?: number;
}
export function Textarea({
  rows = 3,
  controlClassName = "form-control",
  className = "",
  style = {},
  defaultValue = getDefaultValue({}),
  ...props
}: TextareaProps) {
  const ref: MutableRefObject<HTMLTextAreaElement> = useRef();
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    if (props.value !== undefined) {
      if (props.value != value) {
        setValue(props.value || defaultValue);
      }
    } else {
      setValue(defaultValue);
    }
  }, [props.value]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "0px";
    ref.current.style.height = ref.current.scrollHeight + "px";
    if (props.onChange) props.onChange(value);
  }, [value]);

  return (
    <>
      {value !== undefined && (
        <textarea
          tabIndex={props.noFocus && -1}
          ref={ref}
          rows={rows}
          id={props.id}
          className={`${controlClassName} outline-none box-content py-2 ${
            props.error ? "error" : ""
          } ${className}`}
          style={{
            width: `calc(100% - 26px)`,
            minHeight: 40 + (rows - 1) * 29,
            ...style,
          }}
          name={props.name}
          readOnly={props.readonly}
          value={value}
          placeholder={props.placeholder}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
      )}
    </>
  );
}

const getDefaultValue = (props: TextareaProps) => {
  return "";
};

Textarea.getDefaultValue = getDefaultValue;
