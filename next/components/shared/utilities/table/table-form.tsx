import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";
import { Form, FormPropsType } from "../form/form";
import { SaveButtonGroupProps } from "./../save-button-group";
import { useDataTable } from "./data-table";

interface PropsType extends FormPropsType {
  hasFooter?: boolean;
  saveButtonGroupProps?: SaveButtonGroupProps;
  checkValidation?: (data: any, item: any) => boolean;
  beforeSubmit?: (data: any) => any;
}

export function TableForm({ hasFooter = true, saveButtonGroupProps = {}, ...props }: PropsType) {
  const { itemName, formItem, setFormItem, saveItem } = useDataTable();
  const [initialData, setInitialData] = useState(formItem);
  const onSubmit = async (data) => {
    let newData = { ...data };
    if (props.checkValidation) {
      if (!props.checkValidation(newData, formItem)) return;
    }
    if (props.beforeSubmit) newData = props.beforeSubmit(newData);
    await saveItem(newData);
  };

  useEffect(() => {
    setInitialData(formItem ? cloneDeep(formItem) : null);
  }, [formItem]);

  return (
    <Form
      width={"550px"}
      initialData={initialData}
      {...props}
      title={`${formItem?.id ? "Cập nhật" : "Tạo"} ${itemName} ${formItem?.id ? "" : "mới"}`.trim()}
      dialog
      isOpen={!!initialData}
      onClose={() => setFormItem(null)}
      onSubmit={onSubmit}
    >
      {props.children}
      {hasFooter && (
        <Form.Footer>
          <Form.ButtonGroup
            onCancel={() => setFormItem(null)}
            cancelText="Đóng"
            submitText={`${formItem?.id ? "Cập nhật" : "Tạo"} ${itemName} ${
              formItem?.id ? "" : "mới"
            }`.trim()}
            {...saveButtonGroupProps}
          />
        </Form.Footer>
      )}
    </Form>
  );
}
