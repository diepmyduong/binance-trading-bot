import {
  createContext,
  useContext,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  Children,
  Fragment,
} from "react";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import isMatch from "lodash/isMatch";
import pick from "lodash/pick";
import { FieldConstraint } from "./field";
import { Dialog, DialogPropsType } from "../dialog/dialog";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { SaveButtonGroup, SaveButtonGroupProps } from "../save-button-group";

interface FieldValidator extends FieldConstraint {
  required?: boolean;
  validate?: (val: any, data?: any) => Promise<string>;
}

export interface FormPropsType extends Partial<DialogPropsType> {
  dialog?: boolean;
  disableDialogCloseAlert?: boolean;
  grid?: boolean;
  initialData?: any;
  name?: string;
  disabled?: boolean;
  validatorFn?: (data: any) => Object;
  onSubmit?: (data: any, context?: Partial<FormContextProps>) => any;
  onChange?: (data: any, fullData?: any) => any;
  onReset?: (data: any) => any;
  onHasChanged?: (hasChanged: boolean) => any;
}

export function Form({ className = "", style = {}, ...props }: FormPropsType) {
  const getUUID = () => Math.floor(Math.random() * 10) + new Date().getTime().toString(36);

  const [id, setId] = useState<string>();
  const [initialData, setInitialData] = useState<any>();
  const [data, setData] = useState<any>();
  const [fullData, setFullData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const ref: MutableRefObject<HTMLFormElement> = useRef();
  const alert = useAlert();
  const [validators, setValidators] = useState({});
  let context: Partial<FormContextProps> = {};

  let children = Children.map(props.children, (child) =>
    child?.type?.displayName !== "FormHeader" && child?.type?.displayName !== "FormFooter"
      ? child
      : null
  );

  useEffect(() => {
    setId(props.name || getUUID());
  }, []);

  useEffect(() => {
    if (props.dialog && props.isOpen) reset();
  }, [props.isOpen]);

  useEffect(() => {
    if (!isEqual(props.initialData, initialData) || !initialData) {
      setInitialData(cloneDeep(props.initialData) || {});
      setData(props.initialData ? pick(props.initialData, fieldNames) : {});
      setFullData(props.initialData ? pick(props.initialData, fieldNames) : {});
      setHasChanged(false);
    }
  }, [props.initialData, props.isOpen]);

  useEffect(() => {
    if (props.onChange) props.onChange(data, fullData);
  }, [data, fullData]);

  const validate = async (): Promise<boolean> => {
    let newErrors: any = {};
    for (let key of Object.keys(validators)) {
      let validator = validators[key] as FieldValidator;
      let error = await validateField(data[key], validator, data);
      if (error) newErrors[key] = error;
    }
    let customValidatorErrors = {};
    if (props.validatorFn) customValidatorErrors = props.validatorFn(data);
    newErrors = { ...customValidatorErrors, ...newErrors };
    setErrors({ ...customValidatorErrors, ...newErrors });
    return Object.values(newErrors).every((x) => !x);
  };

  const reset = () => {
    setErrors({});
    const newInitialData = cloneDeep(initialData);
    setInitialData(newInitialData);
    setTimeout(() => {
      setData(cloneDeep(newInitialData));
      setFullData(cloneDeep(newInitialData));
      setHasChanged(false);
      if (props.onReset) props.onReset(newInitialData);
    });
  };

  const submit = async () => {
    if (!(await validate())) return null;
    if (props.onSubmit) {
      try {
        setLoading(true);
        await props.onSubmit(data, context);
        setHasChanged(false);
      } finally {
        setLoading(false);
      }
    }
    return data;
  };

  const onFieldChange = (name: string, value: any, extraValue: any) => {
    if (!fieldNames.includes(name)) return;
    let newData = { ...data, [name]: value };
    data[name] = value;
    setData(newData);
    fullData[name] = extraValue;
    setFullData({ ...fullData, [name]: extraValue });
    errors[name] = "";
    setErrors({ ...errors, [name]: "" });
    let hasChanged = !isMatch(initialData, newData);
    setHasChanged(hasChanged);
    if (props.onHasChanged) props.onHasChanged(hasChanged);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit();
  };

  const onReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();
  };

  const registerField = (
    name: string = "",
    defaultValue: any = null,
    fieldValidator: FieldValidator = {}
  ) => {
    if (name) {
      if (!fieldNames.includes(name)) {
        fieldNames.push(name);
        setFieldNames(cloneDeep(fieldNames));
      }
      if (initialData[name] === undefined) {
        initialData[name] = defaultValue;
        setInitialData({ ...initialData, [name]: defaultValue });
      }
      if (data[name] === undefined) {
        data[name] = defaultValue;
        setData({ ...data, [name]: defaultValue });
      }
      if (fullData[name] === undefined) {
        fullData[name] = defaultValue;
        setFullData({ ...data, [name]: defaultValue });
      }
      validators[name] = fieldValidator;
    }
  };

  const unregisterField = (name: string = "") => {
    if (name) {
      if (fieldNames.includes(name)) {
        fieldNames.splice(fieldNames.indexOf(name));
        setFieldNames(cloneDeep(fieldNames));
      }
      delete validators[name];
      delete initialData[name];
      setInitialData({ ...initialData });
      delete data[name];
      setData({ ...data });
      delete fullData[name];
      setFullData({ ...data });
    }
  };

  const onDialogClose = async () => {
    if (props.dialog && props.onClose) {
      if (
        hasChanged &&
        !props.disableDialogCloseAlert &&
        !(await alert.warn(
          "Đóng biểu mẫu",
          "Có dữ liệu đã thay đổi. Bạn có chắc chắn muốn đóng biểu mẫu?",
          "Đóng biểu mẫu"
        ))
      )
        return;
      props.onClose();
    }
  };
  let Wrapper: any = Fragment;
  let Body: any = Fragment;
  let dialogProps = {};
  if (props.dialog) {
    const {
      wrapperClass,
      overlayClass,
      dialogClass,
      extraDialogClass,
      headerClass,
      extraHeaderClass,
      bodyClass,
      extraBodyClass,
      footerClass,
      extraFooterClass,
      title,
      icon,
      width,
      maxWidth,
      mobileSizeMode,
      slideFromBottom,
      isOpen,
      onOverlayClick,
    } = props;

    dialogProps = {
      wrapperClass,
      overlayClass,
      dialogClass,
      extraDialogClass,
      headerClass,
      extraHeaderClass,
      bodyClass,
      extraBodyClass,
      footerClass,
      extraFooterClass,
      title,
      icon,
      width: width || "450px",
      maxWidth,
      mobileSizeMode,
      slideFromBottom,
      isOpen,
      onClose: onDialogClose,
      onOverlayClick,
    };
    Wrapper = Dialog;
    Body = Dialog.Body;
  }

  context = {
    id,
    initialData,
    data,
    fullData,
    loading,
    setLoading,
    disabled: props.disabled || loading,
    errors,
    registerField,
    unregisterField,
    onFieldChange,
    submit,
    reset,
    validate,
    setData,
    title: props.title,
    onClose: onDialogClose,
  };

  return (
    <Wrapper {...dialogProps}>
      <Body>
        <form
          id={id}
          ref={ref}
          className={`${props.grid ? "grid grid-cols-12 gap-x-5" : ""} ${className || ""}`}
          style={style}
          onSubmit={onSubmit}
          onReset={onReset}
        >
          <FormContext.Provider value={context}>
            {Children.map(props.children, (child) =>
              child?.type?.displayName === "FormHeader" ? (
                <div
                  className={`col-span-12 flex justify-center uppercase font-bold text-gray-700 ${
                    child.props.className || ""
                  }`}
                >
                  {child}
                </div>
              ) : null
            )}

            {initialData && data && children}

            {Children.map(props.children, (child) =>
              child?.type?.displayName === "FormFooter" ? (
                <div
                  className={`col-span-12 mt-auto flex flex-row-reverse justify-start gap-1 ${
                    child.props.className || ""
                  }`}
                >
                  {child}
                </div>
              ) : null
            )}
          </FormContext.Provider>
        </form>
      </Body>
    </Wrapper>
  );
}

interface FormContextProps {
  title: string;
  initialData: any;
  data: any;
  fullData: any;
  id: string;
  disabled: boolean;
  loading: boolean;
  setLoading: (val) => any;
  errors: any;
  submit: () => Promise<any>;
  reset: () => any;
  validate: () => Promise<boolean>;
  registerField: (name: string, defaultValue: any, fieldValidators: FieldValidator) => any;
  unregisterField: (name: string) => any;
  onFieldChange: (name: string, value: any, extraValue?: any) => any;
  setData?: (data: any) => any;
  onClose?: () => Promise<any>;
}

const FormContext = createContext<Partial<FormContextProps>>(null);

export const FormConsumer = ({
  children,
}: {
  children: (props: Partial<FormContextProps>) => any;
}) => {
  return <FormContext.Consumer>{children}</FormContext.Consumer>;
};
export const useForm = () => useContext(FormContext);

const Header = ({ children }: ReactProps) => children;
Header.displayName = "FormHeader";
Form.Header = Header;

const Footer = ({ children }: ReactProps) => children;
Footer.displayName = "FormFooter";
Form.Footer = Footer;

Form.Consumer = FormConsumer;

const ButtonGroup = ({
  submitText = "",
  cancelText = "Đóng",
  onCancel,
  ...props
}: SaveButtonGroupProps) => {
  const { title, onClose, loading } = useForm();

  return (
    <SaveButtonGroup
      isLoading={loading}
      cancelText={cancelText}
      submitText={submitText || title}
      onCancel={() => {
        if (onCancel) onCancel();
        else onClose();
      }}
      {...props}
    />
  );
};
Form.ButtonGroup = ButtonGroup;

const validateField = async (value: any, validator: FieldValidator, data: any): Promise<string> => {
  if (validator.required) {
    if (value) {
      if (Array.isArray(value) && !value.length) {
        return "Bắt buộc";
      }
    } else {
      if (typeof value == "number") {
        if (value === null || value === undefined) {
          return "Bắt buộc";
        }
      } else {
        return "Bắt buộc";
      }
    }
  }
  if (validator.min) {
    if (typeof value == "string" && value?.length < validator.min) {
      return `Ít nhất ${validator.min} ký tự`;
    } else if (typeof value == "number" && value < validator.min) {
      return `Lớn hơn hoặc bằng ${validator.min}`;
    } else if (Array.isArray(value) && value?.length < validator.min) {
      return `Chọn ít nhất ${validator.min}`;
    }
  }
  if (validator.max) {
    if (typeof value == "string" && value?.length > validator.max) {
      return `Nhiều nhất ${validator.max} ký tự`;
    } else if (typeof value == "number" && value > validator.max) {
      return `Nhỏ hơn hoặc bằng ${validator.max}`;
    } else if (Array.isArray(value) && value?.length > validator.max) {
      return `Chọn nhiều nhất ${validator.max}`;
    }
  }
  if (validator.validate) {
    const error = await validator.validate(value, data);
    if (error) return error;
  }
  return "";
};
