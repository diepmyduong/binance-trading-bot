import { Label } from "./label";
import { Children, cloneElement, useEffect, useState } from "react";
import { useForm } from "./form";
import cloneDeep from "lodash/cloneDeep";

export interface FieldConstraint {
  min?: number;
  max?: number;
  minDate?: Date;
  maxDate?: Date;
}

interface PropsType extends ReactProps {
  name?: string;
  label?: string;
  error?: string;
  tooltip?: string;
  required?: boolean;
  readonly?: boolean;
  noError?: boolean;
  noFocus?: boolean;
  constraints?: FieldConstraint;
  description?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  validate?: (value: any, data?: any) => Promise<string>;
}
export function Field({ className = "", style = {}, ...props }: PropsType) {
  const form = useForm();
  const {
    id,
    initialData,
    data,
    disabled,
    errors,
    registerField,
    unregisterField,
    onFieldChange,
  } = form ? form : ({} as any);
  const error = errors ? errors[props.name] : "";

  const [fieldName, setFieldName] = useState<string>();
  const [value, setValue] = useState<any>(
    initialData && props.name ? cloneDeep(initialData[props.name]) : undefined
  );
  const child = Children.toArray(props.children)[0] as JSX.Element;

  useEffect(() => {
    let interval;
    if (registerField && props.name && !props.readonly) {
      interval = setInterval(() => {
        if (initialData) {
          registerField(
            props.name,
            child.props.defaultValue || child.type.getDefaultValue(child.props),
            {
              required: !!props.required,
              validate: props.validate,
              ...(props.constraints || {}),
            }
          );
          clearInterval(interval);
        }
      }, 10);
    }
    return () => {
      if (unregisterField && props.name) {
        unregisterField(props.name);
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    if (props.name) {
      if (props.readonly) {
        if (unregisterField) {
          unregisterField(props.name);
        }
      } else {
        if (initialData) {
          registerField(
            props.name,
            child.props.defaultValue || child.type.getDefaultValue(child.props),
            {
              required: !!props.required,
              validate: props.validate,
              ...(props.constraints || {}),
            }
          );
        }
      }
    }
  }, [props.readonly]);

  useEffect(() => {
    if (props.name && id) {
      setFieldName(`${props.name}-${id}`);
    }
  }, [props.name, id]);

  useEffect(() => {
    if (props.name && data && initialData && data[props.name] !== initialData[props.name]) {
      setValue(data[props.name]);
      setTimeout(() => {
        let initValue = cloneDeep(initialData[props.name]);
        setValue(initValue);
        onChange(initValue);
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (child.props.value !== undefined && data[props.name] != child.props.value) {
      onChange(child.props.value);
    }
  }, [child.props.value]);

  const onChange = (value: any, extraValue?: any) => {
    if (onFieldChange && props.name) {
      if (child.props.number || child.props.type == "number") {
        onFieldChange(props.name, extraValue, value);
      } else {
        onFieldChange(props.name, value, extraValue);
      }
    }
  };

  return (
    <div
      className={`auto-rows-min ${props.cols ? "col-span-" + props.cols : ""} ${className}`}
      style={{ ...style }}
      onClick={(e) => (props.onClick ? props.onClick(e) : false)}
    >
      {props.label && (
        <Label
          text={props.label}
          description={props.description}
          htmlFor={fieldName}
          tooltip={props.tooltip}
          required={props.required}
          error={props.error || error}
        />
      )}
      {props.name && child
        ? cloneElement(child, {
            value: child.props.value ? child.props.value : value,
            onChange: (val, extraVal) => {
              onChange(val, extraVal);
              if (child.props.onChange) child.props.onChange(val, extraVal);
            },
            name: props.name,
            id: fieldName,
            noFocus: props.noFocus,
            disabled: props.readonly || child.props.readonly || disabled,
            readonly: props.readonly || child.props.readonly || disabled,
            error: props.error || error,
          })
        : cloneElement(child, {
            value: child.props.value ? child.props.value : value,
            onChange: (val, extraVal) => {
              if (child.props.onChange) child.props.onChange(val, extraVal);
            },
            noFocus: props.noFocus,
            disabled: props.readonly || child.props.readonly || disabled,
            readonly: props.readonly || child.props.readonly || disabled,
          })}
      {!props.noError && (
        <div className="font-semibold text-sm pt-0.5 min-h-6 text-danger text-right pr-0.5">
          {(props.error || error) && (
            <span className="animate-emerge-up">{props.error || error}</span>
          )}
        </div>
      )}
    </div>
  );
}

Field.displayName = "Field";
