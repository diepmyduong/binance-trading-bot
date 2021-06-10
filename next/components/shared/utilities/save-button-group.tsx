import { Button } from "./form/button";

export interface SaveButtonGroupProps extends ReactProps {
  onSubmit?: () => any;
  onCancel?: () => any;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  disableCancle?: boolean;
  actions?: JSX.Element[];
}
export function SaveButtonGroup({
  submitText = "Lưu thay đổi",
  cancelText = "Huỷ",
  disableCancle = false,
  ...props
}: SaveButtonGroupProps) {
  return (
    <div className={`w-full pt-1 flex items-center flex-row-reverse  ` + props.className}>
      <Button
        text={submitText}
        primary
        submit
        isLoading={props.isLoading}
        onClick={props.onSubmit}
      />
      {!disableCancle && <Button text={cancelText} reset onClick={props.onCancel} />}

      {props.actions && props.actions.map((btn, index) => <div key={index}>{btn}</div>)}
    </div>
  );
}
