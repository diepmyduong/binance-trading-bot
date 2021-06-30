import { useEffect, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine, RiMoreFill } from "react-icons/ri";
import { Form, FormConsumer, FormPropsType } from "../form/form";
import { Select } from "../form/select";
import { PaginationComponent } from "../pagination/pagination-component";
import { useDataTable } from "./data-table";
import { SaveButtonGroup } from "./../save-button-group";

interface PropsType extends FormPropsType {
  hasFooter?: boolean;
  checkValidation?: (data: any, item: any) => boolean;
  beforeSubmit?: (data: any) => any;
}

export function TableForm({ hasFooter = true, ...props }: PropsType) {
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
    setInitialData(formItem ? { ...formItem } : null);
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
    >
      {props.children}
      {hasFooter && (
        <Form.Footer>
          <FormConsumer>
            {({ submit }) => (
              <SaveButtonGroup
                onSubmit={async () => {
                  let data = await submit();
                  if (data) await onSubmit(data);
                }}
                onCancel={() => setFormItem(null)}
                cancelText="Đóng"
                submitText={`${formItem?.id ? "Cập nhật" : "Tạo"} ${itemName} ${
                  formItem?.id ? "" : "mới"
                }`.trim()}
              />
            )}
          </FormConsumer>
        </Form.Footer>
      )}
    </Form>
  );
}
