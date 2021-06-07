import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { RiCheckboxBlankCircleLine, RiRadioButtonLine } from "react-icons/ri";

export interface RadioProps extends FormControlProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  options?: Option[];
  optionsPromise?: () => Promise<Option[]>;
  selectFirst?: boolean;
  theme?: "" | "white";
  uncheckedIcon?: JSX.Element;
  checkedIcon?: JSX.Element;
}
export function Radio({
  controlClassName = "form-checkbox",
  className = "",
  style = {},
  theme = "",
  uncheckedIcon = <RiCheckboxBlankCircleLine />,
  checkedIcon = <RiRadioButtonLine />,
  defaultValue = getDefaultValue({}),
  ...props
}: RadioProps) {
  const [options, setOptions] = useState(props.options);
  const [loading, setLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(false);
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    } else {
      if (options && props.selectFirst) {
        setValue(options[0].value || defaultValue);
      } else {
        setValue(defaultValue);
      }
    }
  }, [props.value]);

  useEffect(() => {
    if (props.cols || (options?.length && options.find((x) => x.cols))) {
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
        if (res?.length && props.selectFirst) {
          setValue(res[0].value);
          if (props.onChange) props.onChange(res[0].value, res[0]);
        }
      });
    }
  }, [props.optionsPromise]);

  useEffect(() => {
    if (options?.length && props.selectFirst) {
      setValue(options[0].value);
      if (props.onChange) props.onChange(options[0].value, options[0]);
    }
  }, []);

  const onClickOption = (option: Option) => {
    setValue(option.value);
    if (props.onChange) props.onChange(option.value, option);
  };

  return (
    <div
      className={`pl-1 gap-x-1 ${isGrid ? "grid grid-cols-12" : "flex"} ${className}`}
      style={{ ...style }}
    >
      {options?.map((option) => (
        <div
          key={option.value}
          className={`${controlClassName} ${
            props.cols || option.cols ? `col-span-${option.cols || props.cols}` : "col-auto"
          } ${props.error ? "error" : ""} ${props.readonly ? "readonly" : ""} ${
            option.value == value ? "checked" : ""
          }`}
          onClick={() => onClickOption(option)}
        >
          <i>{uncheckedIcon}</i>
          <i className="check">{checkedIcon}</i>
          <div>{option.label}</div>
        </div>
      ))}
      {loading && props.optionsPromise && (
        <div className={`${controlClassName} col-span-12 pt-1.5`}>
          <i className="pt-0 self-start animate-spin">
            <CgSpinner />
          </i>
          <span className="loading-ellipsis">Đang tải</span>
        </div>
      )}
    </div>
  );
}

const getDefaultValue = (props: RadioProps) => {
  return null;
};

Radio.getDefaultValue = getDefaultValue;
