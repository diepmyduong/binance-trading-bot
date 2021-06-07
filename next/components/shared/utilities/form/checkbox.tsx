import { useEffect, useState } from "react";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { CgSpinner } from "react-icons/cg";

export interface CheckboxProps extends FormControlProps {
  cols?: Cols;
  multi?: boolean;
  options?: Option[];
  optionsPromise?: () => Promise<Option[]>;
  theme?: "" | "white";
  uncheckedIcon?: JSX.Element;
  checkedIcon?: JSX.Element;
}
export function Checkbox({
  multi = false,
  controlClassName = "form-checkbox",
  className = "",
  style = {},
  theme = "",
  uncheckedIcon = <RiCheckboxBlankLine />,
  checkedIcon = <RiCheckboxFill />,
  defaultValue = getDefaultValue({ multi }),
  ...props
}: CheckboxProps) {
  const [value, setValue] = useState<boolean | string[]>();
  const [options, setOptions] = useState(props.options);
  const [loading, setLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(false);

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value || defaultValue);
    } else {
      setValue(defaultValue);
    }
  }, [props.value]);

  useEffect(() => {
    if (multi && (props.cols || (options?.length && options.find((x) => x.cols)))) {
      setIsGrid(true);
    } else {
      setIsGrid(false);
    }
  }, [props.cols, options]);

  useEffect(() => {
    if (!options && props.optionsPromise) {
      setLoading(true);
      props.optionsPromise().then((res) => {
        setOptions(res);
        setLoading(false);
      });
    }
  }, [props.optionsPromise]);

  const onClickOption = (val) => {
    let index = (value as string[]).findIndex((x) => x == val);
    let newValues;
    if (index >= 0) {
      newValues = [...(value as string[])];
      newValues.splice(index, 1);
      setValue(newValues);
    } else {
      newValues = options
        .filter((option) => (value as string[]).includes(option.value) || option.value == val)
        .map((x) => x.value);
      setValue(newValues);
    }
    if (props.onChange)
      props.onChange(
        newValues,
        options.filter((x) => newValues.includes(x.value))
      );
  };

  const toggle = () => {
    let newVal = !value;
    setValue(newVal);
    if (props.onChange) props.onChange(newVal);
  };

  return (
    <div className={`pl-1 gap-x-1 ${isGrid ? "grid grid-cols-12" : "flex"} ${className}`}>
      {!multi && (
        <div
          className={`${controlClassName} w-full ${props.readonly ? "readonly" : ""} ${
            value ? "checked" : ""
          } ${theme}`}
          style={{ ...style }}
          onClick={toggle}
        >
          <i>{uncheckedIcon}</i>
          <i className="check">{checkedIcon}</i>
          <div>{props.placeholder}</div>
        </div>
      )}
      {multi &&
        options?.map((option) => (
          <div
            key={option.value}
            className={`${controlClassName} ${
              props.cols || option.cols ? `col-span-${option.cols || props.cols}` : ""
            } ${props.error ? "error" : ""} ${props.readonly ? "readonly" : ""} ${
              (value as string[])?.includes(option.value) ? "checked" : ""
            } ${theme}`}
            onClick={() => onClickOption(option.value)}
          >
            <i>{uncheckedIcon}</i>
            <i className="check">{checkedIcon}</i>
            <div>{option.label}</div>
          </div>
        ))}
      {loading && props.optionsPromise && (
        <div className={`${controlClassName} col-span-12 pt-1.5`}>
          <i className="self-start animate-spin">
            <CgSpinner />
          </i>
          <span className="loading-ellipsis">Đang tải</span>
        </div>
      )}
    </div>
  );
}

const getDefaultValue = (props: CheckboxProps) => {
  return props.multi ? [] : false;
};

Checkbox.getDefaultValue = getDefaultValue;
