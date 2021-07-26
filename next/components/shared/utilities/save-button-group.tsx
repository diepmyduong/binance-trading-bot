import { Button, ButtonProps } from "./form/button";

export interface SaveButtonGroupProps extends ReactProps {
  onSubmit?: () => any;
  onCancel?: () => any;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  actions?: JSX.Element[];
  submitProps?: ButtonProps;
  bgGadient?: boolean;
}
export function SaveButtonGroup({
  submitText = "Lưu thay đổi",
  cancelText = "Huỷ",
  submitProps = {},
  bgGadient = false,
  ...props
}: SaveButtonGroupProps) {
  return (
    <div className={`w-full pt-1 flex items-center flex-row-reverse  ` + props.className}>
      <Button
        text={submitText}
        primary
        submit
        className={`${bgGadient && "bg-gradient"}`}
        isLoading={props.isLoading}
        onClick={props.onSubmit}
        {...submitProps}
      />
      {cancelText && <Button text={cancelText} reset onClick={props.onCancel} />}

      {props.actions && props.actions.map((btn, index) => <div key={index}>{btn}</div>)}
    </div>
  );
}
