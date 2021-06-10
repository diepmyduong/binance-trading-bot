import { useEffect, useState } from "react";

interface SwitchProps extends FormControlProps {}
export function Switch({
  controlClassName = "form-switch",
  className = "",
  style = {},
  defaultValue = getDefaultValue({}),
  ...props
}: SwitchProps) {
  const [value, setValue] = useState<boolean>(props.value);

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value || defaultValue);
    } else {
      setValue(defaultValue);
    }
  }, [props.value]);

  const toggle = () => {
    if (props.readonly) return;

    let newVal = !value;
    setValue(newVal);
    if (props.onChange) props.onChange(newVal);
  };

  return (
    <div
      className={`${controlClassName} cursor-pointer ${props.error ? "error" : ""} ${className} ${
        props.readonly ? "readonly" : ""
      }`}
      style={{ ...style }}
      onClick={toggle}
    >
      <span className={`switch`}>
        <input
          type="checkbox"
          value={value as any}
          checked={value}
          name={props.name}
          readOnly={props.readonly}
          onChange={() => {}}
        />
        <span className="slider round"></span>
      </span>
      {props.placeholder && <span className="switch-text px-2">{props.placeholder}</span>}
    </div>
  );
}

const getDefaultValue = (props: SwitchProps) => {
  return false;
};

Switch.getDefaultValue = getDefaultValue;
